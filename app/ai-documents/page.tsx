'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain, Zap, Shield, Clock, CheckCircle, FileText, Database, Cloud } from "lucide-react"
import Link from "next/link"
import { QuizModal } from "@/components/quiz-modal"

export default function AIDocumentsPage() {
  const [quizOpen, setQuizOpen] = useState(false)
  const features = [
    {
      icon: Brain,
      title: "Искусственный интеллект",
      description: "Наша система использует передовые алгоритмы машинного обучения для автоматического распознавания и классификации документов"
    },
    {
      icon: Zap,
      title: "Мгновенная обработка",
      description: "Документы обрабатываются в реальном времени с точностью до 99.8%"
    },
    {
      icon: Shield,
      title: "Безопасность данных",
      description: "Все документы шифруются и хранятся в защищенном облаке с соблюдением требований 152-ФЗ"
    },
    {
      icon: Clock,
      title: "24/7 доступность",
      description: "Система работает круглосуточно, обрабатывая документы в любое время дня и ночи"
    },
    {
      icon: CheckCircle,
      title: "Автоматическая проверка",
      description: "ИИ проверяет корректность заполнения документов и выявляет потенциальные ошибки"
    },
    {
      icon: FileText,
      title: "Умная классификация",
      description: "Автоматическое определение типа документа и его назначения"
    },
    {
      icon: Database,
      title: "Интеграция с 1С",
      description: "Автоматическая загрузка данных в систему 1С:Предприятие"
    },
    {
      icon: Cloud,
      title: "Облачное хранение",
      description: "Безопасное хранение всех документов в облаке с возможностью быстрого доступа"
    }
  ]

  const benefits = [
    {
      title: "Экономия времени",
      description: "Сокращение времени на обработку документов на 80%",
      value: "80%"
    },
    {
      title: "Снижение ошибок",
      description: "Минимизация человеческих ошибок при вводе данных",
      value: "99.8%"
    },
    {
      title: "Экономия ресурсов",
      description: "Сокращение затрат на бумагу и печать",
      value: "60%"
    }
  ]

  const processSteps = [
    {
      step: "01",
      title: "Загрузка документа",
      description: "Загрузите документ через веб-интерфейс или мобильное приложение"
    },
    {
      step: "02",
      title: "Автоматическое распознавание",
      description: "ИИ анализирует документ и извлекает необходимые данные"
    },
    {
      step: "03",
      title: "Проверка и валидация",
      description: "Система проверяет корректность данных и выявляет ошибки"
    },
    {
      step: "04",
      title: "Интеграция в систему",
      description: "Данные автоматически загружаются в 1С и другие системы учета"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/digital-art-ai-technology-background.jpg')`
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-300 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Link>
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-full mb-8 border border-blue-300/30">
              <Brain className="w-10 h-10 text-blue-300" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ИИ-обработка документов
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Революционная система автоматической обработки документов с использованием искусственного интеллекта
            </p>
            
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Наша система на базе ИИ автоматически распознает, классифицирует и обрабатывает ваши документы, 
              значительно ускоряя процесс ведения учета и снижая вероятность ошибок до минимума.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-blue-300 mb-4">{benefit.value}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Как это работает
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
                <div className="text-6xl font-bold text-blue-300 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-blue-100">{step.description}</p>
              </div>
              
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-blue-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Возможности системы
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/30 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Готовы автоматизировать обработку документов?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Начните использовать ИИ уже сегодня и сэкономьте время на рутинных задачах
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              asChild
            >
              <Link href="/calculator">
                Рассчитать стоимость
              </Link>
            </Button>
                         <Button 
               size="lg" 
               className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
               onClick={() => setQuizOpen(true)}
             >
               Получить скидку
             </Button>
          </div>
                 </div>
       </div>
       
       <QuizModal open={quizOpen} onOpenChange={setQuizOpen} />
     </div>
   )
 }
