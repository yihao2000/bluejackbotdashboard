import { User } from "next-auth";

export interface ClassLineGroup {
  id: string;
  class_line_group_id: string;
  last_linked_at: string;
}

export interface ClassLinkDetail {
  bot_id: string;
  bot_invite_link: string;
  bot_name: string;
  message: string;
}

export interface CardData {
  id: number;
  title: string;
  content: string;
}

export interface Semester {
  semesterID: string;
  description: string;
}

export interface ClassTransaction {
  className: string;
  classTransactionId: string;
  lecturerCode: string;
  lecturerName: string;
}

export interface Item {
  label: string;
  value: string;
}

export interface Class {
  assistant: string;
  campus: string;
  class: string;
  day: number;
  id: string;
  room: string;
  totalStudent: number;
  shift: string;
  subject: string;
  courseOutlineId: string;
  realization: string;
}

export interface ClassLineGroup {
  class_id: string;
  class_line_group_id: string;
  last_linked_at: string;
}

export interface Channel {
  channel_id: string;
  channel_name: string;
  channel_description: string;
  channel_subscribers: string[];
}

export interface Service {
  service_id: string;
  service_name: string;
  is_enabled: number;
  initial_state_id: string;
}

export interface ServiceState {
  service_state_id: string;
  service_state_name: string;
  service_state_message: string;
  service_state_type: string;
  service_state_data_format: string;
  service_state_data_store: string | undefined;
  service_state_input_options: string;
}

export interface ServiceResponse {
  service_response_id: string;
  service_response_name: string;
  service_response_condition_id: string;
  service_response_condition_value: string;
  service_response_type: string;
  service_response_value: string;
  service_response_state_id: string;
}

export interface ServiceCondition {
  service_condition_id: string;
  service_condition_name: string;
  service_condition_type: string;
  service_condition_value: string
}

export interface ServiceAPICall {
  service_api_call_id: string;
  api_endpoint: string;
  http_method: string;
  payload: string;
}

export interface RoomClass {
  id: String;
  class: String;
  subject: String;
}

export interface MessageTemplate {
  id: string;
  owner_id: string;
  name: string;
  raw_content: string;
  is_shared: boolean,
  data_map: Map<string, any>;
  category: string;
}

export interface AutoResponse {
  id: string
  name: string
  trigger_type: string
  trigger_words: Array<string>
  trigger_recipients: string
  response_message: string
  is_enabled: boolean
}

export interface ScheduledMessage {
  id: string;
  recipients_string: string;
  content: string;
  time: string;
  scheduler_user_id: string;
}

export interface CourseOutline {
  id: string;
  name: string;
  subjects: string;
}
