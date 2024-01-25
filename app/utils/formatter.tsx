import { Fragment, ChangeEvent, ReactNode } from "react";
import { Channel } from "../interfaces/interfaces";
import { Badge, BadgeProps, Text, Input } from "@chakra-ui/react";

export function transformSemesterApiResponse(responseArray: any) {
  return responseArray.map((x: any) => ({
    description: x["a:Description"],
    semesterID: x["a:SemesterId"],
  }));
}

export function transformClassApiReponse(responseArray: any) {
  return responseArray.response["a:Schedule"].map((x: any) => ({
    assistant: x["a:Assistant"],
    campus: x["a:Campus"],
    class: x["a:Class"],
    day: x["a:Day"],
    id: x["a:Id"],
    room: x["a:Room"],
    totalStudent: x["a:TotalStudent"],
    shift: x["a:Shift"],
    subject: x["a:Subject"],
    courseOutlineId: x["a:CourseOutlineId"],
    realization: x["a:Realization"],
  }));
}

export function transformCourseOutlineApiResponse(responseArray: any) {
  return responseArray.response.map((x: any) => ({
    id: x["a:CourseOutlineId"],
    name: transformClassSubjectFormat(x["a:Name"]),
    subjects: x["a:Subjects"],
  }));
}

export function transformClassNameFormat(className: string) {
  const parts = className.split("-");

  if (parts.length === 2) {
    const formattedString = `${parts[0]} (LAB) - ${parts[1]} (LEC)`;
    return formattedString;
  } else {
    // Handle the case when the input string doesn't have the expected format
    return className;
  }
}

export function transformClassTransactionApiResponse(responseArray: any) {
  if (Array.isArray(responseArray.response)) {
    return responseArray.response.map((x: any) => ({
      label: transformClassSubjectFormat(x["a:ClassName"]),
      value: x["a:ClassTransactionId"],
    }));
  } else {
    // Handle the case when responseArray.response is not an array
    console.error("Response is not an array:", responseArray.response);
    return [];
  }
}

export function transformClassSubjectFormat(subject: String) {
  return subject.split("-").join(" - ");
}

export function transformStringToDate(date: string) {
  return new Date(date).toDateString();
}

export function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

export function convertDateFormat(date: Date): string {
  // Get individual components of the date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Determine the UTC offset in minutes
  const utcOffsetMinutes = date.getTimezoneOffset();

  // Convert UTC offset to the desired format
  const utcOffsetHours = Math.floor(Math.abs(utcOffsetMinutes) / 60)
    .toString()
    .padStart(2, "0");
  const utcOffsetSign = utcOffsetMinutes < 0 ? "+" : "-";

  // Construct the formatted date string
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:00UTC${utcOffsetSign}${utcOffsetHours}00`;

  return formattedDate;
}

export function transformChannelData(data: any[]): Channel[] {
  const transformedData: Channel[] = [];

  data.forEach((item) => {
    const existingChannel = transformedData.find(
      (channel) => channel.channel_id === item.channel_id
    );

    if (existingChannel) {
      existingChannel.channel_subscribers.push(item.class_id);
    } else {
      const newChannel: Channel = {
        channel_id: item.channel_id,
        channel_name: item.channel_name,
        channel_description: item.channel_description,
        channel_subscribers: [item.class_id],
      };

      transformedData.push(newChannel);
    }
  });

  return transformedData;
}

  export const parseContent = (content: string): ReactNode[] => {
      const regex = /\{\?([^#\?}]+)#(free|fixed):?([^\}]*)\}/g;
      const elements: ReactNode[] = [];
      let lastIndex = 0;

      const addTextWithNewlines = (text: string) => {
          const lines = text.split('\n');
          return lines.map((line, index) => (
              <Fragment key={index}>
                  {index > 0 && <br />}
                  {line}
              </Fragment>
          ));
      };

      content.replace(regex, (match: string, variableName: string, type: string, fixedText: string, index: number) => {
          if (index > lastIndex) {
              elements.push(addTextWithNewlines(content.slice(lastIndex, index)));
          }

          // Style for simulated badge
          const badgeStyle = {
              backgroundColor: type === 'free' ? '#9AE6B4' : '#FEB2B2', // Green or Orange background
              color: 'black', // Text color
              borderRadius: '2px', // Rounded corners
              padding: '2px 4px', // Padding inside the span
              margin: '0 2px', // Margin around the span
          };

          elements.push(
              <span style={badgeStyle}>
                  {type === 'fixed' && fixedText ? fixedText : variableName}
              </span>
          );

          lastIndex = index + match.length;
          return '';
      });

      if (lastIndex < content.length) {
          elements.push(addTextWithNewlines(content.slice(lastIndex)));
      }

      return elements;
  };

  interface ParseContentActionProps {
    content: string;
    inputValues: { [key: string]: string };
    setInputValues: (inputValues: { [key: string]: string }) => void;
  }
  
  export const parseContentAction = ({
    content,
    inputValues,
    setInputValues,
  }: ParseContentActionProps): ReactNode[] => {
    const regex = /\{\?([^#\?}]+)#(free|fixed):?([^\}]*)\}/g;
    const elements: ReactNode[] = [];
    let lastIndex = 0;
  
    content.replace(
      regex,
      (
        match: string,
        variableName: string,
        type: string,
        fixedText: string,
        index: number
      ) => {
        if (index > lastIndex) {
          elements.push(content.slice(lastIndex, index));
        }
  
        if (type === "free") {
          const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            setInputValues({
              ...inputValues,
              [variableName]: event.target.value,
            });
          };
  
          const textFieldProps = {
            key: variableName + index,
            placeholder: fixedText || variableName,
            value: inputValues[variableName] || "",
            onChange: handleInputChange,
            mx: "0",
            width: "sm",
          };
  
          elements.push(
            <Input display="inline-block" maxWidth="sm" {...textFieldProps} />
          );
        } else {
          const badgeProps: BadgeProps = {
            key: variableName + index,
            colorScheme: type === "free" ? "green" : "orange",
            mx: "0",
          };
  
          elements.push(
            <Badge {...badgeProps} display="inline-block">
              {type === "fixed" && fixedText ? fixedText : variableName}
            </Badge>
          );
        }
  
        lastIndex = index + match.length;
        return "";
      }
    );
  
    if (lastIndex < content.length) {
      elements.push(content.slice(lastIndex));
    }
  
    return elements;
  };
  
  export const processContentWithUserInputs = (
    content: string,
    userInputValues: { [key: string]: string }
  ): string | boolean => {
    const regex = /\{\?([^#\?}]+)#(free|fixed):?([^\}]*)\}/g;
  
    const processedContent = content.replace(
      regex,
      (match, variableName, type) => {
        if (type === "free" && userInputValues[variableName] !== undefined) {
          return userInputValues[variableName];
        }
        return match;
      }
    );
  
    const remainingPlaceholderRegex = /\{\?\w+#free\}/g;
    return remainingPlaceholderRegex.test(processedContent)
      ? false
      : processedContent;
  };
  
  export function transformStudentClassResponse(responseArray: any){
    console.log(responseArray)
    return responseArray.map((x: any) => ({
      class: x["response"]["a:Class"],
      subject: x["response"]["a:Subject"],
      id: x["response"]["id"]
    }));
  }


  export function convertAndAdjustDate(dateString: string) {
    // Convert the original string to a Date object
    const originalDate = new Date(dateString);
  
    // Add 7 hours to the date
    originalDate.setHours(originalDate.getHours());
  
    // Manually build the formatted date string
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[originalDate.getDay()];
  
    const day = originalDate.getDate().toString().padStart(2, '0');
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const year = originalDate.getFullYear();
  
    const hours = originalDate.getHours().toString().padStart(2, '0');
    const minutes = originalDate.getMinutes().toString().padStart(2, '0');
    const seconds = originalDate.getSeconds().toString().padStart(2, '0');
  
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };
  
    const formattedDate = originalDate.toLocaleString('en-US', options);
    const [formattedDay, formattedRest] = formattedDate.split(', '); // Splitting the weekday from the rest
  
    const timePart = `${hours}:${minutes}:${seconds}`;
  
    return `${formattedDay}, ${day}/${month}/${year} ${timePart}`;
  }
  