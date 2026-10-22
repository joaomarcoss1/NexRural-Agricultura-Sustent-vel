import numpy as np
from PIL import Image, ImageDraw, ImageFilter
S='/tmp/claude-0/-home-user-NexRural-Agricultura-Sustent-vel/f50a88ec-72b5-5c71-a883-5c59cc60590b/'
A=S+'scratchpad/art/'
one=Image.open(S+'images/1.jpg').convert('RGB')
two=Image.open(S+'images/2.jpg').convert('RGB')

# --- woman (from ref image 1): crop x 598..1024, y 0..550
X0=598; W=426; H=550
w=one.crop((X0,0,X0+W,H)).convert('RGBA')
arr=np.array(w).astype(np.float32)
rr,gg,bb=arr[...,0],arr[...,1],arr[...,2]
mx=np.maximum(np.maximum(rr,gg),bb); mn=np.minimum(np.minimum(rr,gg),bb)
dark=(mx<122).astype(np.uint8)*255
bp=Image.new('L',(W,H),0); ImageDraw.Draw(bp).polygon([(10,374),(104,374),(140,440),(140,550),(10,550)],fill=1)
dm0=Image.fromarray(dark*np.array(bp)).filter(ImageFilter.MaxFilter(7))
dm=(np.array(dm0.filter(ImageFilter.GaussianBlur(2.5))).astype(np.float32)/255)[...,None]
skin=((rr>130)&(rr>gg+15)&(rr-bb>40))
skin=np.array(Image.fromarray(skin.astype(np.uint8)*255).filter(ImageFilter.MaxFilter(9)))>0
valid=((np.array(dm0)==0)&(~skin)).astype(np.float32); valid[:, :12]=0
def gk(s):
    r=int(3*s)+1; x=np.arange(-r,r+1); k=np.exp(-x*x/(2*s*s)); return k/k.sum()
def gb(a,s):
    k=gk(s); a=np.apply_along_axis(lambda v:np.convolve(np.pad(v,len(k)//2,mode='edge'),k,mode='valid'),0,a)
    return np.apply_along_axis(lambda v:np.convolve(np.pad(v,len(k)//2,mode='edge'),k,mode='valid'),1,a)
fill=np.zeros_like(arr[...,:3]); got=np.zeros((H,W),np.float32)
for s in (6,14,30,60,120):
    den=gb(valid,s)
    ok=(den>0.02)&(got==0)
    for c in range(3):
        num=gb(arr[...,c]*valid,s)
        fill[...,c]=np.where(ok,num/np.maximum(den,1e-3),fill[...,c])
    got=np.where(ok,1,got)
loose=((rr>55)&(rr>gg+12)&(rr>bb+20)).astype(np.uint8)*255
loose=np.array(Image.fromarray(loose).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1)))[...,None].astype(np.float32)/255
ramp=np.clip((np.arange(H)-372)/4,0,1)[:,None,None].astype(np.float32)
lramp=np.clip((np.arange(W)-8)/6,0,1)[None,:,None].astype(np.float32)
dm=dm*(1-loose)*ramp*lramp
arr[...,:3]=arr[...,:3]*(1-dm)+fill*dm
w=Image.fromarray(arr.clip(0,255).astype(np.uint8)).convert('RGBA')
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
pass       # pointing hand + back of hand
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
