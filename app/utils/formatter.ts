import { Channel } from "../interfaces/interfaces";

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
      realization: x["a:Realization"]
    }));
  }


  export function transformClassSubjectFormat(subject: String){
    return subject.split("-").join(" - ")
  }

  export function transformStringToDate(date: string){
    return new Date(date).toDateString()
  }

  export function formatTime(date: Date) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }



  export function convertDateFormat(date: Date): string {
  
    // Get individual components of the date
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
 
  
    // Determine the UTC offset in minutes
    const utcOffsetMinutes = date.getTimezoneOffset();
  
    // Convert UTC offset to the desired format
    const utcOffsetHours = Math.floor(Math.abs(utcOffsetMinutes) / 60).toString().padStart(2, '0');
    const utcOffsetSign = utcOffsetMinutes < 0 ? '+' : '-';
  
    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}UTC${utcOffsetSign}${utcOffsetHours}00`;
  
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
  
  export function transformStudentClassResponse(responseArray: any){
    console.log(responseArray)
    return responseArray.map((x: any) => ({
      class: x["response"]["a:Class"],
      subject: x["response"]["a:Subject"],
      id: x["response"]["id"]
    }));
  }