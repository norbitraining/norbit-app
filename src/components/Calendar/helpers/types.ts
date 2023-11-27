import {NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
export interface CalendarProps extends DefaultProps, CalendarHeaderProps {
  onChangePlanningFilter: (index: number) => void;
}

export type WeekItemProps = Pick<DefaultProps, 'date'> & {
  selectedDate: boolean;
  onSelectDate: (d: Date) => void;
  selectedColor?: string;
};

export type DefaultProps = {
  date: Date;
  selectedColor?: string;
  onPressDate: (d: Date) => void;
  showMonth?: boolean;
  shadow?: boolean;
};

export type CalendarHeaderProps = {
  language?: Language;
  currentMonth?: string;
  currentDate?: Date;
  onChangeMonth?: (month: number, fullDate?: Date) => void;
  onChangeFullDate?: (date: Date) => void;
};

export type Language = 'en' | 'es';

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
