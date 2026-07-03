type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: Props) {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
}