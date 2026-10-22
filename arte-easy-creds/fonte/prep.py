import numpy as np
from PIL import Image, ImageDraw, ImageFilter
S='/tmp/claude-0/-home-user-NexRural-Agricultura-Sustent-vel/f50a88ec-72b5-5c71-a883-5c59cc60590b/'
A=S+'scratchpad/art/'
one=Image.open(S+'images/1.jpg').convert('RGB')
two=Image.open(S+'images/2.jpg').convert('RGB')

# --- woman (from ref image 1): crop x 598..1024, y 0..550
X0=598; W=426; H=550
w=one.crop((X0,0,X0+W,H)).convert('RGBA')
a=np.ones((H,W),dtype=np.float32)
# bottom fade
for y in range(H):
    if y>525: a[y,:]=max(0,1-(y-525)/25)
# left feather only above the hand zone
for x in range(100):
    a[:395,x]*=min(1,max(0,(x-38)/60))
for x in range(5):
    a[395:,x]*=x/5
al=Image.fromarray((a*255).astype(np.uint8))
w.putalpha(al); w.save(A+'woman.png')

# --- hands overlay: skin pixels inside the two hand polygons
rgb=np.array(one.crop((X0,0,X0+W,H))).astype(int)
r,g,b=rgb[...,0],rgb[...,1],rgb[...,2]
skin=((r>130)&(r>g+15)&(g>b-5)&(r-b>40)).astype(np.uint8)*255
poly=Image.new('L',(W,H),0); d=ImageDraw.Draw(poly)
d.polygon([(10,428),(150,424),(145,548),(10,548)],fill=255)           # holding hand (asset coords)
d.polygon([(162,422),(426,422),(426,548),(162,548)],fill=255)       # pointing hand + back of hand
m=Image.fromarray(skin).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
m=m.point(lambda v:255 if v>127 else 0).filter(ImageFilter.MinFilter(3))
m=Image.fromarray((np.array(m)*(np.array(poly)>0)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
m=m.point(lambda v:min(255,int(v*1.6)))
h=w.copy(); h.putalpha(m); h.save(A+'hands.png')

# --- card: perspective-flatten from image 2
src=two.crop((620,40,1080,350))
quad=(10,62, 35,300, 445,255, 405,8)   # TL, BL, BR, TR
card=src.transform((880,560),Image.QUAD,quad,Image.BICUBIC).convert('RGBA')
card.save(A+'card.png')

# --- logo from image 1, feathered
lg=one.crop((50,55,630,255)).convert('RGBA')
Wl,Hl=lg.size; f=np.ones((Hl,Wl),np.float32)
for i in range(28):
    k=i/28
    f[i,:]=np.minimum(f[i,:],k); f[Hl-1-i,:]=np.minimum(f[Hl-1-i,:],k)
    f[:,i]=np.minimum(f[:,i],k); f[:,Wl-1-i]=np.minimum(f[:,Wl-1-i],k)
lr=np.array(lg)[...,0].astype(np.float32)
key=np.clip((lr-55)/75,0,1)
lg.putalpha(Image.fromarray((np.maximum(key*f,0)*255).astype(np.uint8))); lg.save(A+'logo.png')

# --- money from image 2 (optional)
money=two.crop((690,1010,1122,1402)).convert('RGBA'); money.save(A+'money.png')
print('ok')
