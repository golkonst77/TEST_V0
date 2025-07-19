// app/test-env/page.tsx

const TestEnvPage = () => {
  // Этот лог по-прежнему важен, и его нужно искать в ТЕРМИНАЛЕ
  console.log("--- СЕРВЕРНАЯ ПРОВЕРКА (ИЩИТЕ В ТЕРМИНАЛЕ) ---");
  console.log(
    "Сервер: NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  console.log("Сервер: ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);
  console.log("--------------------------");

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', fontSize: '16px', lineHeight: '1.6' }}>
      <h1>Результаты проверки переменных окружения</h1>
      
      <h2>Переменные, которые видит СЕРВЕР при отрисовке страницы:</h2>
      
      <p>
        <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
        <br />
        <span>{process.env.NEXT_PUBLIC_SUPABASE_URL || '!!! НЕ НАЙДЕНО !!!'}</span>
      </p>
      
      <p>
        <strong>ADMIN_PASSWORD:</strong> 
        <br />
        <span>{process.env.ADMIN_PASSWORD || '!!! НЕ НАЙДЕНО !!!'}</span>
      </p>
      
      <p>
        <strong>SUPABASE_SERVICE_ROLE_KEY:</strong> 
        <br />
        <span>{process.env.SUPABASE_SERVICE_ROLE_KEY || '!!! НЕ НАЙДЕНО !!!'}</span>
      </p>

      <hr style={{margin: '20px 0'}} />
      <p>Теперь, пожалуйста, посмотрите в свой терминал (где запущен `npm run dev`) и найдите лог "--- СЕРВЕРНАЯ ПРОВЕРКА ---".</p>
    </div>
  );
};

export default TestEnvPage;