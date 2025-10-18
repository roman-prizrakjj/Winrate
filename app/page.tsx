import { redirect } from 'next/navigation';

export default function Home() {
  // Автоматически перенаправляем на страницу команд
  redirect('/teams');
}
