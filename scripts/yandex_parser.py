#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для парсинга отзывов с Яндекс.Карт
Использует requests и BeautifulSoup
"""

import sys
import json
import argparse
try:
    import requests  # optional; only needed for network scraping
except Exception:
    requests = None
from bs4 import BeautifulSoup
import re
import time
from datetime import datetime
import locale

# Принудительно устанавливаем UTF-8 кодировку
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

def parse_yandex_reviews(company_id):
    """
    Парсит отзывы с Яндекс.Карт для указанной компании
    
    Args:
        company_id (int): ID компании в Яндекс.Картах
        
    Returns:
        dict: Результат парсинга с отзывами
    """
    try:
        if requests is None:
            raise RuntimeError("Python module 'requests' is not installed. Network scraping requires 'requests'. For local HTML import use parse_yandex_reviews_from_file.")
        print(f"Начинаю парсинг отзывов для компании ID: {company_id}")
        
        # URL для отзывов
        url = f"https://yandex.ru/maps/org/prosto_byuro/{company_id}/reviews/"
        
        # Заголовки для имитации браузера
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        print(f"Загружаю страницу: {url}")
        
        # Делаем запрос
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        print(f"Страница загружена, размер: {len(response.text)} байт")
        
        # Парсим HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Ищем информацию о компании
        company_info = {}
        company_name = soup.find('h1', class_='orgpage-header-view__title')
        if company_name:
            company_info['name'] = company_name.get_text(strip=True)
        
        # Ищем рейтинг
        rating_element = soup.find('span', class_='business-rating-badge-view__rating')
        if rating_element:
            try:
                company_info['rating'] = float(rating_element.get_text(strip=True))
            except:
                company_info['rating'] = 0
        
        # Ищем отзывы
        reviews = []
        
        # Селекторы для отзывов (пробуем разные варианты)
        review_selectors = [
            '.business-review-view',
            '.business-review-card',
            '.review-card',
            '.orgpage-reviews-card',
            '[data-testid="business-review-card"]'
        ]
        
        review_elements = []
        for selector in review_selectors:
            elements = soup.select(selector)
            if elements:
                review_elements = elements
                print(f"Найдено {len(elements)} отзывов с селектором: {selector}")
                break
        
        if not review_elements:
            # Попробуем найти отзывы по другим признакам
            review_elements = soup.find_all('div', class_=re.compile(r'review|card'))
            print(f"Найдено {len(review_elements)} потенциальных отзывов")
        
        print(f"Анализирую {len(review_elements)} элементов отзывов...")
        
        # Сохраняем HTML первого отзыва для анализа
        if review_elements:
            with open("yandex_review_sample.html", "w", encoding="utf-8") as f:
                f.write(str(review_elements[0]))
            print("Сохранён HTML первого отзыва в yandex_review_sample.html")
        
        for i, element in enumerate(review_elements):  # Обрабатываем все найденные отзывы
            try:
                print(f"\nАнализ отзыва {i+1}:")
                print(f"   HTML: {str(element)[:200]}...")
                
                # Ищем имя автора
                author_selectors = [
                    '.business-review-view__author-name',
                    '.business-review-card__author-name',
                    '.review-author-name',
                    '.author-name',
                    '[data-testid="reviewer-name"]',
                    '.business-review-view__author',
                    '.business-review-card__author'
                ]
                
                author_name = "Гость"
                for selector in author_selectors:
                    author_elem = element.select_one(selector)
                    if author_elem:
                        author_name = author_elem.get_text(strip=True)
                        print(f"   Автор найден: {author_name}")
                        break
                
                # Ищем текст отзыва
                text_selectors = [
                    '.business-review-view__body .spoiler-view__text-container',
                    '.business-review-view__body',
                    '.business-review-view__body-text',
                    '.business-review-card__text',
                    '.review-text',
                    '.review-body',
                    '[data-testid="review-text"]',
                    '.business-review-view__text',
                    '.business-review-card__body'
                ]
                
                review_text = ""
                for selector in text_selectors:
                    text_elem = element.select_one(selector)
                    if text_elem:
                        review_text = text_elem.get_text(strip=True)
                        print(f"   Текст найден: {review_text[:50]}...")
                        break
                # Если не нашли, пробуем искать .business-review-view__body напрямую
                if not review_text:
                    body_elem = element.select_one('.business-review-view__body')
                    if body_elem:
                        review_text = body_elem.get_text(strip=True)
                        print(f"   Текст найден из body: {review_text[:50]}...")
                
                # Ищем дату
                date_selectors = [
                    '.business-review-view__date',
                    '.business-review-card__date',
                    '.review-date',
                    '.date'
                ]
                
                review_date = ""
                for selector in date_selectors:
                    date_elem = element.select_one(selector)
                    if date_elem:
                        review_date = date_elem.get_text(strip=True)
                        print(f"   Дата найдена: {review_date}")
                        break
                
                # Ищем рейтинг
                rating_selectors = [
                    '.business-rating-badge-view__rating',
                    '.rating-value',
                    '.stars',
                    '.business-review-view__rating',
                    '.business-review-card__rating'
                ]
                
                review_rating = 5
                for selector in rating_selectors:
                    rating_elem = element.select_one(selector)
                    if rating_elem:
                        try:
                            rating_text = rating_elem.get_text(strip=True)
                            rating_num = int(rating_text)
                            if 1 <= rating_num <= 5:
                                review_rating = rating_num
                                print(f"   Рейтинг найден: {review_rating}")
                                break
                        except:
                            pass
                
                # Добавляем отзыв только если есть текст
                if review_text and len(review_text) > 10:
                    reviews.append({
                        'id': f"yandex_{hash(review_text)}",
                        'author': author_name,
                        'rating': review_rating,
                        'text': review_text,
                        'date': review_date,
                        'source': 'yandex-maps',
                        'avatar': '',
                        'response': ''
                    })
                    print(f"   Отзыв добавлен!")
                else:
                    print(f"   Текст отзыва слишком короткий или отсутствует")
                    
            except Exception as e:
                print(f"Ошибка при парсинге отзыва {i+1}: {e}")
                continue
        
        print(f"\nУспешно получены данные:")
        print(f"   - Название компании: {company_info.get('name', 'Неизвестно')}")
        print(f"   - Рейтинг: {company_info.get('rating', 0)}")
        print(f"   - Количество отзывов: {len(reviews)}")
        
        return {
            'success': True,
            'reviews': reviews,
            'company_info': company_info,
            'total_reviews': len(reviews),
            'source': 'yandex-maps-requests'
        }
        
    except Exception as e:
        print(f"Ошибка при парсинге: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'reviews': [],
            'total_reviews': 0,
            'source': 'yandex-maps-requests'
        }

def parse_yandex_reviews_from_html(html: str):
    """
    Парсит отзывы из HTML-строки (локальный HTML, содержимое передано через stdin)
    """
    try:
        soup = BeautifulSoup(html, 'html.parser')
        # Новый селектор для отзывов
        review_elements = soup.select('.business-review-view__body')
        print(f"Найдено {len(review_elements)} отзывов по .business-review-view__body")
        reviews = []
        for i, element in enumerate(review_elements):
            try:
                # Текст отзыва
                text_elem = element.select_one('.spoiler-view__text-container')
                review_text = text_elem.get_text(strip=True) if text_elem else ''
                # Автор (ищем вверх по DOM)
                author = 'Гость'
                parent = element.parent
                if parent:
                    author_elem = parent.select_one('.business-review-view__author-container')
                    if author_elem:
                        author = author_elem.get_text(strip=True)
                # Дата (ищем в текущем или родителе)
                review_date = ''
                date_elem = element.select_one('.business-review-view__date')
                if not date_elem and parent:
                    date_elem = parent.select_one('.business-review-view__date')
                if date_elem:
                    review_date = date_elem.get_text(strip=True)
                # Рейтинг (по умолчанию 5)
                review_rating = 5
                # Добавляем отзыв
                if review_text and len(review_text) > 5:
                    reviews.append({
                        'id': f"yandex_{hash(review_text)}",
                        'author': author,
                        'rating': review_rating,
                        'text': review_text,
                        'date': review_date,
                        'source': 'yandex-maps',
                        'avatar': '',
                        'response': ''
                    })
            except Exception as e:
                print(f"Ошибка при парсинге отзыва {i+1}: {e}")
                continue
        print(f"\nУспешно получено данных:")
        print(f"   - Количество отзывов: {len(reviews)}")
        return {
            'success': True,
            'reviews': reviews,
            'company_info': {},
            'total_reviews': len(reviews),
            'source': 'yandex-maps-local-html'
        }
    except Exception as e:
        print(f"Ошибка при парсинге локального HTML: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'reviews': [],
            'total_reviews': 0,
            'source': 'yandex-maps-local-html'
        }


def parse_yandex_reviews_from_file(html_path):
    """
    Парсит отзывы из локального HTML-файла, скачанного с Яндекс.Карт
    """
    try:
        print(f"Читаю локальный HTML-файл: {html_path}")
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()
        return parse_yandex_reviews_from_html(html)
    except Exception as e:
        print(f"Ошибка при парсинге локального файла: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'reviews': [],
            'total_reviews': 0,
            'source': 'yandex-maps-local-html'
        }

def main():
    """Основная функция для запуска из командной строки"""
    parser = argparse.ArgumentParser(description='Парсер отзывов Яндекс.Карты')
    group = parser.add_mutually_exclusive_group(required=False)
    group.add_argument('--stdin', action='store_true', help='Читать HTML из STDIN')
    group.add_argument('--html', type=str, help='Путь к локальному HTML-файлу')
    group.add_argument('--company-id', type=int, help='ID компании в Яндекс.Картах')
    parser.add_argument('--output', type=str, help='Путь для сохранения результата в JSON-файл')

    # Backward compatibility: allow a single positional arg
    parser.add_argument('positional', nargs='?', default=None,
                        help='Совместимость: <company_id|html_file|->')

    args = parser.parse_args()

    result = None
    # Resolve input source
    if args.stdin or args.positional == '-' or args.positional == '--stdin':
        data = sys.stdin.read()
        result = parse_yandex_reviews_from_html(data)
    elif args.html or (args.positional and isinstance(args.positional, str) and args.positional.lower().endswith('.html')):
        html_path = args.html if args.html else args.positional
        result = parse_yandex_reviews_from_file(html_path)
    elif args.company_id is not None or (args.positional and args.positional.isdigit()):
        company_id = args.company_id if args.company_id is not None else int(args.positional)
        result = parse_yandex_reviews(company_id)
    else:
        print("Использование: python yandex_parser.py [--stdin | --html <file> | --company-id <id>] [--output <json>]")
        sys.exit(1)

    # Write output
    if args.output:
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print(json.dumps({
                'success': True,
                'message': f'Результат сохранён в {args.output}',
                'total_reviews': result.get('total_reviews', len(result.get('reviews', [])))
            }, ensure_ascii=False), flush=True)
        except Exception as e:
            print(json.dumps({'success': False, 'error': str(e)}, ensure_ascii=False), flush=True)
            sys.exit(1)
    else:
        print(json.dumps(result, ensure_ascii=False), flush=True)

if __name__ == "__main__":
    main() 