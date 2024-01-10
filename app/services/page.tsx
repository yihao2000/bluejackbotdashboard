"use client";
import {
  Box,
  Text,
  Button,
  HStack,
  Icon,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  useToast,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import Nav from "../components/navbar";
import { GoBroadcast } from "react-icons/go";
import { useEffect, useState } from "react";
import { Channel, Service, ServiceState, ServiceResponse, ServiceCondition, ServiceAPICall } from "../interfaces/interfaces";
import { createOrSaveService, createOrSaveServiceApiCall, createOrSaveServiceCondition, createOrSaveServiceResponse, createOrSaveServiceState, queryChannels, queryServiceApiCalls, queryServiceConditions, queryServiceResponses, queryServiceStates, queryServices } from "../utils/constants";
import { CreateChannelModal } from "../components/modal/createchannelmodal";
import ChannelDetailCard from "../components/cards/channeldetailcard";
import { transformChannelData } from "../utils/formatter";
import { ServiceItemDetailCard } from "../components/cards/servicedetailcard";
import { ServiceConfirmationModal } from "../components/modal/serviceconfirmationmodal";
import { FiCompass } from "react-icons/fi";
import { ServiceModal } from "../components/modal/servicemodal";

export default function Services() {
  type DeletableItem = Service | ServiceState | ServiceResponse | ServiceCondition | ServiceAPICall | null;

  const toast = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [states, setStates] = useState<ServiceState[]>([]);
  const [responses, setResponses] = useState<ServiceResponse[]>([]);
  const [conditions, setConditions] = useState<ServiceCondition[]>([]);
  const [apiCalls, setApiCalls] = useState<ServiceAPICall[]>([]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedState, setSelectedState] = useState<ServiceState | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<ServiceResponse | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<ServiceCondition | null>(null);
  const [selectedApiCall, setSelectedApiCall] = useState<ServiceAPICall | null>(null);

  const addServiceModalDisclosure = useDisclosure();
  const addStateModalDisclosure = useDisclosure();
  const addResponseModalDisclosure = useDisclosure();
  const addConditionModalDisclosure = useDisclosure();
  const addApiCallModalDisclosure = useDisclosure();

  const editServiceModalDisclosure = useDisclosure();
  const editStateModalDisclosure = useDisclosure();
  const editResponseModalDisclosure = useDisclosure();
  const editConditionModalDisclosure = useDisclosure();
  const editApiCallModalDisclosure = useDisclosure();

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    queryServices().then((res) => {
      setServices(res);
    });
    queryServiceStates().then((res) => {
      setStates(res);
    });
    queryServiceResponses().then((res) => {
      setResponses(res);
    });
    queryServiceConditions().then((res) => {
      setConditions(res);
    });
    queryServiceApiCalls().then((res) => {
      setApiCalls(res);
    });
}, [refresh]);


  const refreshPage = () => {
    console.log("Refreshing");
    setRefresh(!refresh);
  };

  const openAddServiceModal = () => {
    addServiceModalDisclosure.onOpen();
  };
  const openAddStateModal = () => {
    addStateModalDisclosure.onOpen();
  };
  const openAddResponseModal = () => {
    addResponseModalDisclosure.onOpen();
  };
  const openAddConditionModal = () => {
    addConditionModalDisclosure.onOpen();
  };
  const openAddApiCallModal = () => {
    addApiCallModalDisclosure.onOpen();
  };

  const openEditServiceModal = (service : Service) => {
    editServiceModalDisclosure.onOpen();
  };
  const openEditStateModal = (state : ServiceState) => {
    editStateModalDisclosure.onOpen();
  };
  const openEditResponseModal = (response : ServiceResponse) => {
    editResponseModalDisclosure.onOpen();
  };
  const openEditConditionModal = (condition : ServiceCondition) => {
    editConditionModalDisclosure.onOpen();
  };
  const openEditApiCallModal = (apiCall : ServiceAPICall) => {
    editApiCallModalDisclosure.onOpen();
  };

  const handleCreateServiceClick = () => {
    openAddServiceModal();
  };
  const handleCreateStateClick = () => {
    openAddStateModal();
  };
  const handleCreateResponseClick = () => {
    openAddResponseModal();
  };
  const handleCreateConditionClick = () => {
    openAddConditionModal();
  };
  const handleCreateApiCallClick = () => {
    openAddApiCallModal();
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    openEditServiceModal(service);
  };
  const handleEditState = (state: ServiceState) => {
    setSelectedState(state);
    openEditStateModal(state);
  };
  const handleEditResponse = (response: ServiceResponse) => {
    setSelectedResponse(response);
    openEditResponseModal(response);
  };
  const handleEditCondition = (condition: ServiceCondition) => {
    setSelectedCondition(condition);
    openEditConditionModal(condition);
  };
  const handleEditApiCall = (apiCall: ServiceAPICall) => {
    setSelectedApiCall(apiCall);
    openEditApiCallModal(apiCall);
  };
  

  const deleteService = (service: Service) => {
    // API call or database operation to delete the service
    // Example: apiDeleteService(service.service_id).then(refreshPage);
  };
  const deleteState = (state: ServiceState) => {
    // API call or database operation to delete the service
    // Example: apiDeleteService(service.service_id).then(refreshPage);
  };
  const deleteResponse = (response: ServiceResponse) => {
    // API call or database operation to delete the service
    // Example: apiDeleteService(service.service_id).then(refreshPage);
  };
  const deleteCondition = (condition: ServiceCondition) => {
    // API call or database operation to delete the service
    // Example: apiDeleteService(service.service_id).then(refreshPage);
  };
  const deleteApiCall = (apiCall: ServiceAPICall) => {
    // API call or database operation to delete the service
    // Example: apiDeleteService(service.service_id).then(refreshPage);
  };

  const confirmDeletion = () => {
    if (!itemToDelete) return;

    switch (deleteType) {
      case 'service':
        deleteService(itemToDelete as Service);
        break;
      case 'state':
        deleteState(itemToDelete as ServiceState);
        break;
      case 'response':
        deleteResponse(itemToDelete as ServiceResponse);
        break;
      case 'condition':
        deleteCondition(itemToDelete as ServiceCondition);
        break;
      case 'apicall':
        deleteApiCall(itemToDelete as ServiceAPICall);
        break;
    }
  };

  const handleSaveService = (serviceData : Service) => {
    createOrSaveService(serviceData)
      .then((response) => {
        toast({
          title: "Service saved successfully",
          status: "success",
          isClosable: true,
        });
        refreshPage();
      })
      .catch((err) => {
        console.error("Error saving service:", err);
        toast({
          title: "Error! Unable to save service",
          status: "error",
          isClosable: true,
        });
      });
  };

  const handleSaveState = (stateData : ServiceState) => {
    createOrSaveServiceState(stateData)
      .then((response) => {
        toast({
          title: "State saved successfully",
          status: "success",
          isClosable: true,
        });
        refreshPage();
      })
      .catch((err) => {
        console.error("Error saving state:", err);
        toast({
          title: "Error! Unable to save state",
          status: "error",
          isClosable: true,
        });
      });
  };

  const handleSaveResponse = (responseData : ServiceResponse) => {
    createOrSaveServiceResponse(responseData)
      .then((response) => {
        toast({
          title: "Response saved successfully",
          status: "success",
          isClosable: true,
        });
        refreshPage();
      })
      .catch((err) => {
        console.error("Error saving response:", err);
        toast({
          title: "Error! Unable to save response",
          status: "error",
          isClosable: true,
        });
      });
  };

  const handleSaveCondition = (conditionData : ServiceCondition) => {
    createOrSaveServiceCondition(conditionData)
      .then((response) => {
        toast({
          title: "Condition saved successfully",
          status: "success",
          isClosable: true,
        });
        refreshPage();
      })
      .catch((err) => {
        console.error("Error saving condition:", err);
        toast({
          title: "Error! Unable to save condition",
          status: "error",
          isClosable: true,
        });
      });
  };

  const handleSaveApiCall = (apiCallData : ServiceAPICall) => {
    createOrSaveServiceApiCall(apiCallData)
      .then((response) => {
        toast({
          title: "API Call saved successfully",
          status: "success",
          isClosable: true,
        });
        refreshPage();
      })
      .catch((err) => {
        console.error("Error saving API call:", err);
        toast({
          title: "Error! Unable to save API call",
          status: "error",
          isClosable: true,
        });
      });
  };

  const [itemToDelete, setItemToDelete] = useState<DeletableItem>(null);
  const [deleteType, setDeleteType] = useState("");

  const confirmationModalDisclosure = useDisclosure();

  const openConfirmDeleteModal = (item: DeletableItem, type: string) => {
    setItemToDelete(item);
    setDeleteType(type);
    confirmationModalDisclosure.onOpen();
  };

  const handleDeleteService = (service : Service) => {
    openConfirmDeleteModal(service, "service");
  };
  const handleDeleteState = (state : ServiceState) => {
    openConfirmDeleteModal(state, "state");
  };
  const handleDeleteResponse = (response : ServiceResponse) => {
    openConfirmDeleteModal(response, "response");
  };
  const handleDeleteCondition = (condition : ServiceCondition) => {
    openConfirmDeleteModal(condition, "condition");
  };
  const handleDeleteApiCall = (apiCall : ServiceAPICall) => {
    openConfirmDeleteModal(apiCall, "apicall");
  };

  return (
    <>
      <Nav>
        <main className="max-w-full">
          <Box>
            <Box display="flex" justifyContent="space-between">
              <HStack>
                <Icon fontSize="4xl" as={FiCompass} mr={4} />
                <Text fontSize="3xl" fontWeight="bold">
                  Services
                </Text>
              </HStack>
            </Box>
            <Spacer height={10}/>
            <Tabs isFitted variant="enclosed" colorScheme="blue">
              <TabList mb="1em">
                <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Manage Services</Tab>
                <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Manage Service States</Tab>
                <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Manage Service Responses</Tab>
                <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Manage Service Conditions</Tab>
                <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Manage Service API Calls</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Button colorScheme="blue" onClick={openAddServiceModal}>Create New Service</Button>
                  <Box className="grid-cols-3 grid gap-7 mt-10">
                    {services.map(service => (
                      <ServiceItemDetailCard
                        key={service.service_id}
                        item={service}
                        itemType="service"
                        onEdit={handleEditService}
                        onDelete={handleDeleteService}
                      />
                    ))}
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Button colorScheme="blue" onClick={openAddStateModal}>Create New State</Button>
                  <Box className="grid-cols-3 grid gap-7 mt-10">
                    {states.map(state => (
                      <ServiceItemDetailCard
                        key={state.service_state_id}
                        item={state}
                        itemType="state"
                        onEdit={handleEditState}
                        onDelete={handleDeleteState}
                      />
                    ))}
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Button colorScheme="blue" onClick={openAddResponseModal}>Create New Response</Button>
                  <Box className="grid-cols-3 grid gap-7 mt-10">
                    {responses.map(response => (
                      <ServiceItemDetailCard
                        key={response.service_response_id}
                        item={response}
                        itemType="response"
                        onEdit={handleEditResponse}
                        onDelete={handleDeleteResponse}
                      />
                    ))}
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Button colorScheme="blue" onClick={openAddConditionModal}>Create New Condition</Button>
                  <Box className="grid-cols-3 grid gap-7 mt-10">
                    {conditions.map(condition => (
                      <ServiceItemDetailCard
                        key={condition.service_condition_id}
                        item={condition}
                        itemType="condition"
                        onEdit={handleEditCondition}
                        onDelete={handleDeleteCondition}
                      />
                    ))}
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Button colorScheme="blue" onClick={openAddApiCallModal}>Create New API Call</Button>
                  <Box className="grid-cols-3 grid gap-7 mt-10">
                    {apiCalls.map(apiCall => (
                      <ServiceItemDetailCard
                        key={apiCall.service_api_call_id}
                        item={apiCall}
                        itemType="apiCall"
                        onEdit={handleEditApiCall}
                        onDelete={handleDeleteApiCall}
                      />
                    ))}
                  </Box>
                </TabPanel>
              </TabPanels>

            </Tabs>
          </Box>
        </main>
      </Nav>

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={addServiceModalDisclosure.isOpen}
        onClose={addServiceModalDisclosure.onClose}
        mode="create"
        itemType="service"
        onSave={handleSaveService}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={addStateModalDisclosure.isOpen}
        onClose={addStateModalDisclosure.onClose}
        mode="create"
        itemType="state"
        onSave={handleSaveState}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={addResponseModalDisclosure.isOpen}
        onClose={addResponseModalDisclosure.onClose}
        mode="create"
        itemType="response"
        onSave={handleSaveResponse}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={addConditionModalDisclosure.isOpen}
        onClose={addConditionModalDisclosure.onClose}
        mode="create"
        itemType="condition"
        onSave={handleSaveCondition}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={addApiCallModalDisclosure.isOpen}
        onClose={addApiCallModalDisclosure.onClose}
        mode="create"
        itemType="apiCall"
        onSave={handleSaveApiCall}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={editServiceModalDisclosure.isOpen}
        onClose={editServiceModalDisclosure.onClose}
        mode="edit"
        itemType="service"
        itemData={selectedService}
        onSave={handleSaveService}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={editStateModalDisclosure.isOpen}
        onClose={editStateModalDisclosure.onClose}
        mode="edit"
        itemType="state"
        itemData={selectedState}
        onSave={handleSaveState}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={editResponseModalDisclosure.isOpen}
        onClose={editResponseModalDisclosure.onClose}
        mode="edit"
        itemType="response"
        itemData={selectedResponse}
        onSave={handleSaveResponse}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={editConditionModalDisclosure.isOpen}
        onClose={editConditionModalDisclosure.onClose}
        mode="edit"
        itemType="condition"
        itemData={selectedCondition}
        onSave={handleSaveCondition}
      />

      <ServiceModal
        refreshPage={refreshPage}
        isOpen={editApiCallModalDisclosure.isOpen}
        onClose={editApiCallModalDisclosure.onClose}
        mode="edit"
        itemType="apiCall"
        itemData={selectedApiCall}
        onSave={handleSaveApiCall}
      />


      <ServiceConfirmationModal
        isOpen={confirmationModalDisclosure.isOpen}
        onClose={confirmationModalDisclosure.onClose}
        title={`Confirm Deletion`}
        description={`Are you sure you want to delete this ${deleteType}?`}
        onConfirm={confirmDeletion}
      />
      
    </>
  );
}
