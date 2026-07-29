// TicketVariables.tsx
"use client";

const VARIABLES=[
["{user}","Member display name"],
["{username}","Discord username"],
["{mention}","Mention member"],
["{ticket}","Ticket name"],
["{ticketNumber}","Ticket number"],
["{category}","Ticket category"],
["{staff}","Staff mention"],
["{server}","Server name"],
["{serverIcon}","Server icon URL"],
["{memberCount}","Current member count"],
["{date}","Current date"],
["{time}","Current time"],
];

type Props={onInsert?:(value:string)=>void};

export default function TicketVariables({onInsert}:Props){
 return(
  <section className="rounded-2xl border border-border bg-card p-5">
   <h3 className="text-lg font-bold">Variables</h3>
   <p className="mt-1 text-sm text-muted-foreground">
    Click a variable to insert it into any message.
   </p>

   <div className="mt-5 space-y-2">
    {VARIABLES.map(([token,label])=>(
      <button
        key={token}
        type="button"
        onClick={()=>onInsert?.(token)}
        className="flex w-full items-center justify-between rounded-xl border border-border p-3 hover:border-primary hover:bg-primary/5"
      >
        <div className="text-left">
          <div className="font-mono text-primary">{token}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
        <span className="text-xs font-semibold">Insert</span>
      </button>
    ))}
   </div>
  </section>
 );
}