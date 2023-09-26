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