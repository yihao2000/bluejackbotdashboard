import React, { HTMLAttributes } from "react";
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "date-fns/locale/en-US"; // Import the locale you need
import "./date-picker.css";

interface Props {
  isClearable?: boolean;
  selectedDate: Date | null; // Use null instead of undefined
  showPopperArrow?: boolean;
  onChange: (date: Date | null) => any;
}

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  ...props
}: Props & ReactDatePickerProps & HTMLAttributes<HTMLElement>) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      {...props}
    />
  );
};

export default DatePicker;
