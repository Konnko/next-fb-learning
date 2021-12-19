export default function Loader({ show }: { show: boolean }) {
  // emulate spinner with tailwind
  return show ? <div className="loader"></div> : null
}
