

import type React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useLanguage } from "@/contexts/language-context" 

interface MonthYearPickerProps {
  currentDate: { month: number; year: number }
  setCurrentDate: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>
}

export default function MonthYearPicker({ currentDate, setCurrentDate }: MonthYearPickerProps) {
  const isMobile = useMobile()
  const { t, direction } = useLanguage()

  const months = [
    t('monthYearPicker.months.january'),
    t('monthYearPicker.months.february'),
    t('monthYearPicker.months.march'),
    t('monthYearPicker.months.april'),
    t('monthYearPicker.months.may'),
    t('monthYearPicker.months.june'),
    t('monthYearPicker.months.july'),
    t('monthYearPicker.months.august'),
    t('monthYearPicker.months.september'),
    t('monthYearPicker.months.october'),
    t('monthYearPicker.months.november'),
    t('monthYearPicker.months.december')
  ]

  const monthsShort = [
    t('monthYearPicker.monthsShort.jan'),
    t('monthYearPicker.monthsShort.feb'),
    t('monthYearPicker.monthsShort.mar'),
    t('monthYearPicker.monthsShort.apr'),
    t('monthYearPicker.monthsShort.may'),
    t('monthYearPicker.monthsShort.jun'),
    t('monthYearPicker.monthsShort.jul'),
    t('monthYearPicker.monthsShort.aug'),
    t('monthYearPicker.monthsShort.sep'),
    t('monthYearPicker.monthsShort.oct'),
    t('monthYearPicker.monthsShort.nov'),
    t('monthYearPicker.monthsShort.dec')
  ]

  // Generate years (current year - 5 to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start mx-2 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
            isMobile ? "min-w-[120px] px-2" : "min-w-[200px]"
          }`}
        >
          <Calendar className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-foreground truncate">
            {isMobile
              ? `${monthsShort[currentDate.month]} ${currentDate.year.toString().slice(2)}`
              : `${months[currentDate.month]} ${currentDate.year}`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg rounded-xl transition-colors duration-300" dir={direction}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-foreground">{t('monthYearPicker.select_date')}</h3>
        </div>
        <div className="grid gap-4 p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">{t('monthYearPicker.month')}</h4>
            <Select
              value={currentDate.month.toString()}
              onValueChange={(value) => setCurrentDate((prev) => ({ ...prev, month: Number.parseInt(value) }))}
            >
              <SelectTrigger className="rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                <SelectValue placeholder={t('monthYearPicker.select_month')} />
              </SelectTrigger>
              <SelectContent className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300">
                {months.map((month, index) => (
                  <SelectItem
                    key={month}
                    value={index.toString()}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground">{t('monthYearPicker.year')}</h4>
            <Select
              value={currentDate.year.toString()}
              onValueChange={(value) => setCurrentDate((prev) => ({ ...prev, year: Number.parseInt(value) }))}
            >
              <SelectTrigger className="rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                <SelectValue placeholder={t('monthYearPicker.select_year')} />
              </SelectTrigger>
              <SelectContent className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
