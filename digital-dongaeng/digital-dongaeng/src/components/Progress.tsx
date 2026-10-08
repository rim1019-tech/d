export default function Progress({ v, max }: { v: number; max: number }) {
  return (
    <div className="prog" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={max}>
      <i style={{ width: `${(v / max) * 100}%` }} />
    </div>
  );
}
