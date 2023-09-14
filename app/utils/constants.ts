export const API_URL = "http://localhost:3005"

export const CLASSES_DETAIL_QUERY = `${API_URL}/classes/query/classesdetail`
export const LINKED_CLASSES_QUERY = `${API_URL}/classes/query/linkedclasses`
export const LINKED_CLASSES_COURSE_QUERY = `${API_URL}/courses/query/linkedclassescourses`


export const queryLinkedClasses = async () => {
    return fetch(LINKED_CLASSES_QUERY)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      });
  };



export const queryClassesCourses = async () => {
    const response = await fetch(LINKED_CLASSES_COURSE_QUERY);
    if (!response.ok) {
        throw new Error("Error fetching data");
    }
    return await response.json();
  };
  
  
export const queryClassesDetail = async () => {
    const response = await fetch(CLASSES_DETAIL_QUERY);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    const result = await response.json();
    return result;
};




  export const announceMessage = async (selectedClasses: string[], message: string) => {
    try {
      const response = await fetch("https://bluejackbot.jex.ink/server/manualrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cmd: "announce-one-time",
          recipients: selectedClasses.toString(),
          msg: message,
        }),
      });
  
      if (!response.ok) {
        throw new Error("API request failed");
      }
  
      const data = await response.json();
      // Handle the API response data here
      console.log(data);
    } catch (error) {
      console.error("API Error:", error);
      // Re-throw the error to propagate it
      throw error;
    }
  };
  