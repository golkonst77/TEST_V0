import { useState, useEffect } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // Проверяем сразу при загрузке
    checkDeviceType()

    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', checkDeviceType)

    return () => {
      window.removeEventListener('resize', checkDeviceType)
    }
  }, [])

  return deviceType
}
