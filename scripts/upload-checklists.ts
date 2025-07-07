import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Ошибка: Не установлены переменные окружения SUPABASE_URL и SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Маппинг файлов на quiz_result и name (можно доработать под твои нужды)
const checklistMeta: Record<string, { name: string; quiz_result: string }> = {
  'Buhgalterskoe-soprovozhdenie-ProstoByuro.pdf': {
    name: 'Бухгалтерское сопровождение', quiz_result: 'both'
  },
  'Kak-izbezhat-blokirovki-scheta.pdf': {
    name: 'Как избежать блокировки счета', quiz_result: 'both'
  },
  'Kak_vibrat_buh_kompany.pdf': {
    name: 'Как выбрать бух компанию', quiz_result: 'both'
  },
  'Sravnenie-IP-i-OOO-Chto-vybrat-dlya-vashego-biznesa.pdf': {
    name: 'Сравнение ИП и ООО', quiz_result: 'both'
  },
  'Vosstanovlenie-buhgalterskogo-ucheta.pdf': {
    name: 'Восстановление бухучета', quiz_result: 'both'
  },
};

async function uploadChecklists() {
  try {
    console.log('Начинаем загрузку чек-листов...');
    
    // Читаем все PDF файлы из папки CHEK_LIST
    const checklistsDir = join(process.cwd(), 'public', 'CHEK_LIST');
    const files = readdirSync(checklistsDir).filter(file => file.endsWith('.pdf'));

    console.log(`Найдено ${files.length} PDF файлов`);

    let isFirstFile = true; // Флаг для первого файла

    for (const file of files) {
      console.log(`Загружаем файл: ${file}`);
      const filePath = join(checklistsDir, file);
      const fileContent = readFileSync(filePath);

      // Загружаем файл в Supabase Storage
      const { data, error } = await supabase.storage
        .from('checklists')
        .upload(file, fileContent, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) {
        console.error(`Ошибка загрузки файла ${file}:`, error);
      } else {
        console.log(`Файл ${file} успешно загружен`);
        
        // Добавляем запись в таблицу checklists
        const meta = checklistMeta[file] || { name: file, quiz_result: 'both' };
        const { error: dbError } = await supabase
          .from('checklists')
          .insert([
            {
              name: meta.name,
              file_url: file,
              quiz_result: meta.quiz_result,
              is_active: isFirstFile // Первый файл становится активным
            }
          ]);
        
        if (dbError) {
          console.error(`Ошибка добавления в таблицу checklists для файла ${file}:`, dbError);
        } else {
          console.log(`Запись для файла ${file} добавлена в таблицу checklists${isFirstFile ? ' (активный)' : ''}`);
          isFirstFile = false; // Следующие файлы не будут активными
        }
      }
    }

    console.log('Все файлы загружены и добавлены в таблицу');

  } catch (error) {
    console.error('Необработанная ошибка:', error);
  }
}

uploadChecklists(); 