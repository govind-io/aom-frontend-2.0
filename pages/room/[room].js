import { useRouter } from "next/router";

export default function Room() {
  const router = useRouter();

  const { room } = router.query;

  return <h1>This is room {room}</h1>;
}
