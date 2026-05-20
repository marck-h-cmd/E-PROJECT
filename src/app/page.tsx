import { redirect } from 'next/navigation';

/** Pantalla inicial: acceso directo al login */
export default function HomePage() {
  redirect('/auth/login');
}
