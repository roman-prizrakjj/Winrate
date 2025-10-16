import { redirect } from 'next/navigation';

export default function Home() {
  // Автоматически перенаправляем на Dashboard 1
  redirect('/dashboard-1');
}
