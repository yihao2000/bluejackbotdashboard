import { Item, Service, ServiceAPICall, ServiceCondition, ServiceResponse, ServiceState } from "../interfaces/interfaces";

// export const API_URL = "http://bluejackbot.jex.ink:3001";
export const API_URL = "http://localhost:3001";

export const CLASSES_DETAIL_QUERY = `${API_URL}/classes/query/classesdetail`;
export const LINKED_CLASSES_QUERY = `${API_URL}/classes/query/linkedclasses`;
export const LINKED_CLASSES_COURSE_QUERY = `${API_URL}/courses/query/linkedclassescourses`;
export const ALL_SEMESTERS_QUERY = `${API_URL}/semesters/getsemesters`;
export const ACTIVE_SEMESTER_QUERY = `${API_URL}/semesters/getactivesemester`;
export const ASSISTANT_CLASSES_QUERY = `${API_URL}/classes/getassistantclasses`;
export const USER_LOGIN_QUERY = `${API_URL}/users/login`;
export const GET_SALT_QUERY = `${API_URL}/users/get-salt`;
export const ASSISTANT_LINKED_CLASSES_QUERY = `${API_URL}/classes/getlinkedclasses`;
export const CLASS_BOT_QUERY = `${API_URL}/classes/getclassbot`;
export const LINK_CLASS = `${API_URL}/classes/linkclass`;
export const CHECK_CLASS_LINKED_QUERY = `${API_URL}/classes/checkclasslinked`;
export const ANNOUNCE_MESSAGE = `${API_URL}/classes/announceclassesmessage`;
export const SCHEDULE_MESSAGE = `${API_URL}/classes/scheduleclassesmessage`;
export const CHANNELS_QUERY = `${API_URL}/channels/getchannels`;

export const SERVICES_QUERY = `${API_URL}/services/getservices`;
export const SERVICE_STATES_QUERY = `${API_URL}/services/getstates`;
export const SERVICE_RESPONSES_QUERY = `${API_URL}/services/getresponses`;
export const SERVICE_CONDITIONS_QUERY = `${API_URL}/services/getconditions`;
export const SERVICE_APICALLS_QUERY = `${API_URL}/services/getapicalls`;

export const CREATE_SERVICE = `${API_URL}/services/createservice`;
export const CREATE_SERVICE_STATE = `${API_URL}/services/createstate`;
export const CREATE_SERVICE_RESPONSE = `${API_URL}/services/createresponse`;
export const CREATE_SERVICE_CONDITION = `${API_URL}/services/createcondition`;
export const CREATE_SERVICE_APICALL = `${API_URL}/services/createapicall`;

export const UPDATE_SERVICE = `${API_URL}/services/updateservice`;
export const UPDATE_SERVICE_STATE = `${API_URL}/services/updatestate`;
export const UPDATE_SERVICE_RESPONSE = `${API_URL}/services/updateresponse`;
export const UPDATE_SERVICE_CONDITION = `${API_URL}/services/updatecondition`;
export const UPDATE_SERVICE_APICALL = `${API_URL}/services/updateapicall`;

export const CREATE_CHANNEL = `${API_URL}/channels/createchannel`;
export const GET_CLASS_QUERY = `${API_URL}/classes/getstudentclass`;
export const REMOVE_CHANNEL_CLASS = `${API_URL}/channels/removechannelsubscribers`;
export const SCHEDULED_MESSAGES_QUERY = `${API_URL}/messages/getscheduledmessages`;
export const CREATE_MESSAGE_TEMPLATE = `${API_URL}/message_templates/createmessagetemplate`;
export const GET_MESSAGE_TEMPLATES = `${API_URL}/message_templates/getmessagetemplates`;
export const GET_AUTO_RESPONSES = `${API_URL}/message_templates/getAutoResponses`;
export const REMOVE_SCHEDULED_MESSAGE = `${API_URL}/messages/removescheduledmessage`;
export const GET_ACTIVE_SEMESTER_COURSE_OUTLINE = `${API_URL}/semesters/getactivesemestercourseoutlines`;
export const GET_CLASS_TRANSACTION_BY_COURSE_OUTLINE_AND_SEMESTER = `${API_URL}/classes/getclasstransactionbycourseoutlineandsemester`;
export const ADD_CHANNEL_SUBSCRIBERS = `${API_URL}/channels/addchannelsubscribers`;
export const DELETE_CHANNEL = `${API_URL}/channels/deletechannel`


export const getSalt = async (username: string) => {
  const res = await fetch(GET_SALT_QUERY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    throw new Error("Error fetching salt");
  }
  return await res.json();
};

export const queryLinkedClasses = async () => {
  return fetch(LINKED_CLASSES_QUERY).then((response) => {
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

export const queryAssistantClasses = async (
  username: string,
  semesterID: string
) => {
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
};

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
  // console.log(result);
  return result;
};

export const queryActiveSemester = async () => {
  const response = await fetch(ACTIVE_SEMESTER_QUERY);
  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  const result = await response.json();
  console.log(result);
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

export const scheduleMessage = async (
  classes: string[],
  message: string,
  scheduleDate: string,
  schedulerUserId: string,
  repeatOption: string,
) => {
  try {
    const response = await fetch(SCHEDULE_MESSAGE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classes, message, scheduleDate, schedulerUserId, repeatOption }),
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

    return data;
  } catch (error) {
    console.error("API Error:", error);
    // Re-throw the error to propagate it

    throw error;
  }
};

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

    return data;
  } catch (error) {
    console.error("API Error:", error);
    // Re-throw the error to propagate it

    throw error;
  }
};

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
};

export const queryServices = async () => {
  const response = await fetch(SERVICES_QUERY, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const queryServiceStates = async () => {
  const response = await fetch(SERVICE_STATES_QUERY, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const queryServiceResponses = async () => {
  const response = await fetch(SERVICE_RESPONSES_QUERY, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const queryServiceConditions = async () => {
  const response = await fetch(SERVICE_CONDITIONS_QUERY, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const queryServiceApiCalls = async () => {
  const response = await fetch(SERVICE_APICALLS_QUERY, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const createChannel = async (
  channelName: String,
  channelDescription: String
) => {
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
};

export const createOrSaveService = async (serviceData : Service) => {
  const endpoint = serviceData.service_id ? UPDATE_SERVICE : CREATE_SERVICE;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const createOrSaveServiceState = async (stateData : ServiceState) => {
  const endpoint = stateData.service_state_id ? UPDATE_SERVICE_STATE : CREATE_SERVICE_STATE;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const createOrSaveServiceResponse = async (responseData : ServiceResponse) => {
  const endpoint = responseData.service_response_id ? UPDATE_SERVICE_RESPONSE: CREATE_SERVICE_RESPONSE;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const createOrSaveServiceCondition = async (conditionData : ServiceCondition) => {
  const endpoint = conditionData.service_condition_id ? UPDATE_SERVICE_CONDITION : CREATE_SERVICE_CONDITION;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conditionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const createOrSaveServiceApiCall = async (apiCallData : ServiceAPICall) => {
  const endpoint = apiCallData.service_api_call_id ? UPDATE_SERVICE_APICALL : CREATE_SERVICE_APICALL;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiCallData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

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
};

export const removeStudentClass = async (
  channelID: String,
  classID: String
) => {
  const response = await fetch(REMOVE_CHANNEL_CLASS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channelID, classID }),
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};


export const queryScheduledMessages = async () => {
  const response = await fetch(SCHEDULED_MESSAGES_QUERY, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const removeScheduledMessage = async (id: String) => {
  const response = await fetch(REMOVE_SCHEDULED_MESSAGE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const getAutoResponses = async () => {
  const response = await fetch(GET_AUTO_RESPONSES, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const getMessageTemplates = async () => {
  const response = await fetch(GET_MESSAGE_TEMPLATES, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const createMessageTemplate = async (
  name: string,
  content: string,
  data_map: Map<string, string>,
  is_shared: boolean,
  category: string,
  owner_id: string
) => {
  const obj = Object.fromEntries(data_map);
  const response = await fetch(CREATE_MESSAGE_TEMPLATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      content: content,
      data_map: obj,
      is_shared: is_shared,
      category: category,
      owner_id: owner_id,
    }),
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};

export const getActiveSemesterCourseOutlines = async (
  messierID: string,
  semesterID: string
) => {
  try {
    const response = await fetch(GET_ACTIVE_SEMESTER_COURSE_OUTLINE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messierID, semesterID }),
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

export const getClassTransactionByCourseOutlineAndSemester = async (
  semesterID: string,
  courseOutlineID: string
) => {
  try {
    const response = await fetch(
      GET_CLASS_TRANSACTION_BY_COURSE_OUTLINE_AND_SEMESTER,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ semesterID, courseOutlineID }),
      }
    );

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

export const addChannelSubscribers = async (
  channelID: String,
  classesID: String[]
) => {
  try {
    const response = await fetch(ADD_CHANNEL_SUBSCRIBERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelID, classesID }),
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

export const removeChannel = async (
  channelID: String,
) => {
  const response = await fetch(DELETE_CHANNEL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channelID }),
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return await response.json();
};