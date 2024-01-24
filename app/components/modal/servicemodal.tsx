import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Box,
    Switch,
    Select,
    Textarea,
    useToast,
    Stack,
    Divider,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  
  interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    itemType: "service" | "state" | "response" | "condition" | "apiCall";
    itemData?: any;
    onSave: (data: any) => void;
    refreshPage: () => void;
  }
  
  export const ServiceModal: React.FC<ServiceModalProps> = ({
    isOpen,
    onClose,
    mode,
    itemType,
    itemData,
    onSave,
    refreshPage
  }) => {
    const [formData, setFormData] = useState<any>({
        service_state_input_options: ';'
      });
    const toast = useToast();
  
    useEffect(() => {
        if (mode === "edit" && itemData) {
          setFormData(itemData);
        }
    }, [mode, itemData]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSave = () => {
      // Validation and save logic goes here
      onSave(formData);
      toast({
        title: "Success",
        description: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ${mode}d successfully!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    };

    const handleAddOption = () => {
        const optionsArray = formData.service_state_input_options ? formData.service_state_input_options.split(';') : [];
        optionsArray.push('');
        setFormData({ ...formData, service_state_input_options: optionsArray.join(';') });
      };
      
    const handleRemoveOption = (index : number) => {
        const optionsArray = formData.service_state_input_options.split(';');
        optionsArray.splice(index, 1);
        setFormData({ ...formData, service_state_input_options: optionsArray.join(';') });
    };

    const handleUpdateOption = (value : string, index : number) => {
        const optionsArray = formData.service_state_input_options.split(';');
        optionsArray[index] = value;
        setFormData({ ...formData, service_state_input_options: optionsArray.join(';') });
    };
      
      
  
    const renderFormFields = () => {
        switch (itemType) {
          case "service":
            return (
              <>
                <Input placeholder="Service Name" name="service_name" value={formData.service_name || ''} onChange={handleChange} />
                <Select placeholder="Select Initial State" name="initial_state_id" value={formData.initial_state_id || ''} onChange={handleChange}>
                  {/* Options for initial state */}
                </Select>
                <Box display="flex" alignItems="center">
                  <Switch isChecked={formData.is_enabled} onChange={(e) => handleChange(e as any)} name="is_enabled" />
                  <Box ml={2}>Enable/Disable Service</Box>
                </Box>
              </>
            );
      
          case "state":
            return (
              <>
                <Input placeholder="State Name" name="service_state_name" value={formData.service_state_name || ''} onChange={handleChange} />
                <Textarea placeholder="State Message / Value" name="service_state_message" value={formData.service_state_message || ''} onChange={handleChange} />
                <Select placeholder="Select State Type" name="service_state_type" value={formData.service_state_type || ''} onChange={handleChange}>
                    <option value="INPUT_FREETEXT">(Input) Free Text</option>
                    <option value="INPUT_WITHOPTIONS">(Input) Options</option>
                    <option value="OUTPUT_TEXT">(Output) Plain Text</option>
                    <option value="OUTPUT_DATA">(Output) Formatted Data</option>
                </Select>
                {formData.service_state_type === 'OUTPUT_DATA' && (
                    <Input placeholder="State Data Format Key" name="service_state_data_format" value={formData.service_state_data_format || ''} onChange={handleChange} />
                )}
                {(formData.service_state_type === 'INPUT_FREETEXT' || formData.service_state_type === 'INPUT_WITHOPTIONS') && (
                    <Input placeholder="State Data Store Variable Name" name="service_state_data_store" value={formData.service_state_data_store || ''} onChange={handleChange} />
                )}
                {formData.service_state_type === 'INPUT_WITHOPTIONS' && (
                    <>
                        <Box ml={2} mt={2}><b>Input Options</b></Box>
                        {formData.service_state_input_options.split(';').map((option : string, index : number) => (
                        <Box key={index} display="flex" alignItems="center">
                            <Input 
                            value={option} 
                            onChange={(e) => handleUpdateOption(e.target.value, index)} 
                            placeholder={`Option ${index + 1}`}
                            />
                            <Button ml={2} onClick={() => handleRemoveOption(index)}>Delete</Button>
                        </Box>
                        ))}
                        <Button onClick={handleAddOption}>Add Option</Button>
                    </>
                    )}
              </>
            );
      
          case "response":
            return (
              <>
                <Input placeholder="Response Name" name="service_response_name" value={formData.service_response_name || ''} onChange={handleChange} />
                <Select placeholder="Select the state this response belongs to" name="service_response_state_id" value={formData.service_response_state_id || ''} onChange={handleChange}>
                  {/* Options for response state */}
                </Select>
                <Divider/>
                <Select placeholder="Select the condition this response depends on" name="service_response_condition_id" value={formData.service_response_condition_id || ''} onChange={handleChange}>
                  {/* Options for response condition */}
                </Select>
                <Box display="flex" alignItems="center">
                  <Box ml={2} mr={2}>Execute if the condition returns {formData.service_response_condition_value ? 'TRUE' : 'FALSE'}</Box>
                  <Switch isChecked={formData.service_response_condition_value} onChange={(e) => handleChange(e as any)} name="service_response_condition_value" />
                </Box>
                <Divider/>
                <Select placeholder="Select Response Type" name="service_response_type" value={formData.service_response_type || ''} onChange={handleChange}>
                    <option value="JUMP_TO_STATE">Change to another state</option>
                    <option value="FINISH">Finish service execution</option>
                </Select>
                <Input placeholder="Response Value" name="service_response_value" value={formData.service_response_value || ''} onChange={handleChange} />
              </>
            );
      
          case "condition":
            return (
              <>
                <Input placeholder="Condition Name" name="service_condition_name" value={formData.service_condition_name || ''} onChange={handleChange} />
                <Select placeholder="Select Condition Type" name="service_condition_type" value={formData.service_condition_type || ''} onChange={handleChange}>
                    <option value="NONE">None</option>
                    <option value="SIMPLE_EQUALS">String Equals (Case Sensitive)</option>
                    <option value="SIMPLE_CONTAINS">String Contains (Case Sensitive)</option>
                    <option value="MATCH_REGEX">Match Regular Expression</option>
                </Select>
                <Input placeholder="Condition Value" name="service_condition_value" value={formData.service_condition_value || ''} onChange={handleChange} />
              </>
            );
      
          case "apiCall":
            return (
              <>
                <Input placeholder="API Endpoint" name="api_endpoint" value={formData.api_endpoint || ''} onChange={handleChange} />
                <Select placeholder="Select HTTP Method" name="http_method" value={formData.http_method || ''} onChange={handleChange}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                </Select>
                <Textarea placeholder="Payload" name="payload" value={formData.payload || ''} onChange={handleChange} />
              </>
            );
      
          default:
            return null;
        }
      };      
  
    return (
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{mode === "create" ? `Create New ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}` : `Edit ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
                {renderFormFields()}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack spacing={4} direction={'row'}>
                <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                <Button onClick={onClose}>Cancel</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  