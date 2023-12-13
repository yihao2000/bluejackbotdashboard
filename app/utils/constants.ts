export const API_URL = "http://localhost:3001"

export const CLASSES_DETAIL_QUERY = `${API_URL}/classes/query/classesdetail`
export const LINKED_CLASSES_QUERY = `${API_URL}/classes/query/linkedclasses`
export const LINKED_CLASSES_COURSE_QUERY = `${API_URL}/courses/query/linkedclassescourses`
export const ALL_SEMESTERS_QUERY = `${API_URL}/semesters/getsemesters`
export const ACTIVE_SEMESTER_QUERY = `${API_URL}/semesters/getactivesemester`
export const ASSISTANT_CLASSES_QUERY = `${API_URL}/classes/getassistantclasses`
export const USER_LOGIN_QUERY = `${API_URL}/users/login`
export const ASSISTANT_LINKED_CLASSES_QUERY = `${API_URL}/classes/getlinkedclasses`
export const CLASS_BOT_QUERY = `${API_URL}/classes/getclassbot`
export const LINK_CLASS = `${API_URL}/classes/linkclass`
export const CHECK_CLASS_LINKED_QUERY = `${API_URL}/classes/checkclasslinked`
export const ANNOUNCE_MESSAGE = `${API_URL}/classes/announceclassesmessage`
export const SCHEDULE_MESSAGE = `${API_URL}/classes/scheduleclassesmessage`
export const CHANNELS_QUERY = `${API_URL}/channels/getchannels`
export const CREATE_CHANNEL = `${API_URL}/channels/createchannel`
export const GET_CLASS_QUERY = `${API_URL}/classes/getstudentclass`

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
  
  
export const queryAssistantClasses = async (username: string, semesterID: string) => {       
                      const response = await fetch(ASSISTANT_CLASSES_QUERY, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, semesterID }),
                      });
                
                      if (!response.ok) {
                        throw new Error("Error fetching data");
                      } 
                      return await response.json();
}

export const queryLinkedAssistantClasses = async (classIDs: any) => {
  try {
    const response = await fetch(ASSISTANT_LINKED_CLASSES_QUERY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classIDs }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    // Re-throw the error to propagate it
    throw error;
  }
};


export const queryAllSemesters = async () => {
  const response = await fetch(ALL_SEMESTERS_QUERY);
  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  const result = await response.json();
  console.log(result)
  return result;
};

export const queryActiveSemester = async () => {
  const response = await fetch(ACTIVE_SEMESTER_QUERY);
  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  const result = await response.json();
  console.log(result)
  return result;
};

export const checkClassLinked = async (classID: string) => {
  try {
    const response = await fetch(CHECK_CLASS_LINKED_QUERY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    // Re-throw the error to propagate it
    throw error;
  }
};




  export const announceMessage = async (classes: string[], message: string) => {

    try {
      const response = await fetch(ANNOUNCE_MESSAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classes, message }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.message}`);
      }
  
      return await response.json();
    } catch (error) {
    
      console.error("API Error:", error);
      // Re-throw the error to propagate it
      throw error;
    }
  };


  export const scheduleMessage = async (classes: string[], message: string, scheduleDate: string) => {

    try {
      const response = await fetch(SCHEDULE_MESSAGE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classes, message, scheduleDate }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.message}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      // Re-throw the error to propagate it
      throw error;
    }
  };


  export const getClassBot = async (classID: string) => {
    try {
      const response = await fetch(CLASS_BOT_QUERY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.message}`);
      }
      const data = await response.json();
      // Handle the API response data here
      console.log(data);

      return data
    } catch (error) {
      console.error("API Error:", error);
      // Re-throw the error to propagate it

      throw error;
    }
  } 
  

  export const linkClass = async (classID: string, linkCode: String) => {
    try {
      const response = await fetch(LINK_CLASS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classID, linkCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.message}`);
      }
      const data = await response.json();
      // Handle the API response data here
      console.log(data);

      return data
    } catch (error) {
      console.error("API Error:", error);
      // Re-throw the error to propagate it

      throw error;
    }
  } 


  export const queryChannels = async () => {
    const response = await fetch(CHANNELS_QUERY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching data");
    } 
    return await response.json();
  } 


  export const createChannel = async (channelName: String, channelDescription: String) => {
    try {
      const response = await fetch(CREATE_CHANNEL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelName, channelDescription }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.message}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      // Re-throw the error to propagate it
      throw error;
    }
  }

  export const queryStudentClass = async (transactionID: String) => {       
    const response = await fetch(GET_CLASS_QUERY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionID }),
    });

    if (!response.ok) {
      throw new Error("Error fetching data");
    } 
    return await response.json();
}