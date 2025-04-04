import { Control } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface FormFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  type?: string
  options?: { value: string; label: string }[]
}
const FormFieldComponent = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  options,
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === 'radio' ? (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='flex flex-row space-x-1'
              >
                {options?.map((option) => (
                  <FormItem
                    key={option.value}
                    className='flex items-center space-x-3 space-y-0'
                  >
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <FormLabel className='font-normal'>
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            ) : type === 'checkbox' ? (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            ) : (
              <Input placeholder={placeholder} type={type} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormFieldComponent
