"use client"

import {
  Image as ImageIcon,
  Palette,
  Type,
  UserCircle2,
} from "lucide-react"

import type {
  WelcomeImageControlsProps,
} from "./types"

export default function WelcomeImageControls({
  value,
  disabled = false,
  onChange,
}: WelcomeImageControlsProps) {
  const avatar = value.avatar

  function updateAvatar(patch: Partial<typeof avatar>) {
    onChange({
      ...value,
      avatar: {
        ...avatar,
        ...patch,
      },
    })
  }

  return (
    <div className="space-y-6">

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-4 text-primary"/>
          <h3 className="font-semibold">Background</h3>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-medium">
            Background URL
          </span>

          <input
            disabled={disabled}
            value={value.backgroundUrl}
            onChange={(e)=>
              onChange({
                ...value,
                backgroundUrl:e.target.value,
              })
            }
            placeholder="https://..."
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-medium">
            Background Color
          </span>

          <input
            type="color"
            disabled={disabled}
            value={value.backgroundColor}
            onChange={(e)=>
              onChange({
                ...value,
                backgroundColor:e.target.value,
              })
            }
            className="mt-2 h-11 w-full"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <UserCircle2 className="size-4 text-primary"/>
          <h3 className="font-semibold">Avatar</h3>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <NumberField
            label="Size"
            value={avatar.size}
            onChange={(v)=>updateAvatar({size:v})}
          />

          <NumberField
            label="Border"
            value={avatar.borderWidth}
            onChange={(v)=>updateAvatar({borderWidth:v})}
          />

          <label>
            <span className="text-xs font-medium">Shape</span>

            <select
              value={avatar.shape}
              disabled={disabled}
              onChange={(e)=>
                updateAvatar({
                  shape:e.target.value as any,
                })
              }
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3"
            >
              <option value="circle">Circle</option>
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
            </select>
          </label>

          <label>
            <span className="text-xs font-medium">Border Color</span>

            <input
              type="color"
              value={avatar.borderColor}
              disabled={disabled}
              onChange={(e)=>
                updateAvatar({
                  borderColor:e.target.value,
                })
              }
              className="mt-2 h-11 w-full"
            />
          </label>

        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Type className="size-4 text-primary"/>
          <h3 className="font-semibold">
            Text Layers
          </h3>
        </div>

        <div className="mt-4 space-y-3">
          {value.texts.map((text,index)=>(
            <div
              key={text.id}
              className="rounded-xl border border-border p-3"
            >
              <p className="mb-3 text-xs font-semibold">
                Layer {index+1}
              </p>

              <input
                value={text.content}
                disabled={disabled}
                onChange={(e)=>{
                  const texts=[...value.texts]
                  texts[index]={
                    ...text,
                    content:e.target.value,
                  }
                  onChange({...value,texts})
                }}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              />

              <div className="mt-3 grid grid-cols-2 gap-3">

                <NumberField
                  label="Font Size"
                  value={text.fontSize}
                  onChange={(v)=>{
                    const texts=[...value.texts]
                    texts[index]={
                      ...text,
                      fontSize:v,
                    }
                    onChange({...value,texts})
                  }}
                />

                <label>
                  <span className="text-xs font-medium">
                    Color
                  </span>

                  <input
                    type="color"
                    value={text.color}
                    onChange={(e)=>{
                      const texts=[...value.texts]
                      texts[index]={
                        ...text,
                        color:e.target.value,
                      }
                      onChange({...value,texts})
                    }}
                    className="mt-2 h-10 w-full"
                  />
                </label>

              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Palette className="size-4 text-primary"/>
          <h3 className="font-semibold">
            Export
          </h3>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <NumberField
            label="Width"
            value={value.width}
            onChange={(v)=>onChange({...value,width:v})}
          />

          <NumberField
            label="Height"
            value={value.height}
            onChange={(v)=>onChange({...value,height:v})}
          />

        </div>
      </section>

    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
}:{
  label:string
  value:number
  onChange:(v:number)=>void
}){
  return(
    <label>
      <span className="text-xs font-medium">{label}</span>

      <input
        type="number"
        value={value}
        onChange={(e)=>onChange(Number(e.target.value))}
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3"
      />
    </label>
  )
}