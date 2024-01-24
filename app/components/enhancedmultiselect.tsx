import { AutoResponse, Channel, Class, ClassLineGroup } from "@/app/interfaces/interfaces";
import { useState } from 'react';
import { Box, Menu, MenuButton, MenuList, MenuItem, Checkbox, Button, Text } from '@chakra-ui/react';

interface EnhancedMultiSelectProps {
    selectedClasses: string[],
    selectedChannels: string[],
    setSelectedClasses: any,
    setSelectedChannels: any,
    classes: Class[];
    channels: Channel[];
    handleRecipientChange: (selectedClasses: string[], selectedChannels: string[]) => void;
}

const EnhancedMultiSelect: React.FC<EnhancedMultiSelectProps> = ({ selectedClasses, setSelectedClasses, selectedChannels, setSelectedChannels, classes, channels, handleRecipientChange }) => {
    
    const handleClassesChange = (selectedClassId: string) => {
        const isClassSelected = selectedClasses.includes(selectedClassId);
        const updatedSelectedClasses = isClassSelected
            ? selectedClasses.filter((id: string) => id !== selectedClassId)
            : [...selectedClasses, selectedClassId];
        setSelectedClasses(updatedSelectedClasses);
        handleRecipientChange(updatedSelectedClasses, selectedChannels);
    };
    
    const handleChannelsChange = (selectedChannelId: string) => {
        const isChannelSelected = selectedChannels.includes(selectedChannelId);
        const updatedSelectedChannels = isChannelSelected
            ? selectedChannels.filter((id: string) => id !== selectedChannelId)
            : [...selectedChannels, selectedChannelId];
        setSelectedChannels(updatedSelectedChannels);
        handleRecipientChange(selectedClasses, updatedSelectedChannels);
    };
    

    return (
        <Box>
            <Box>Enabled Classes</Box>
            <Menu closeOnSelect={false}>
                <MenuButton as={Button} width={"100%"} backgroundColor={"white"} border="1px solid gray">
                    {selectedClasses.length} Classes Selected
                </MenuButton>
                <MenuList>
                    {classes.map((c) => (
                        <MenuItem key={c.id} onClick={() => handleClassesChange(c.id)}>
                            <Checkbox isChecked={selectedClasses.includes(c.id)} onChange={() => handleClassesChange(c.id)}/>
                            <Text ml={5}>({c.class}) {c.subject}</Text>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            
            <Box mt={2}>(Admin Only) Enabled Channels</Box>
            <Menu closeOnSelect={false}>
                <MenuButton as={Button} width={"100%"} backgroundColor={"white"} border="1px solid gray">
                    {selectedChannels.length} Channels Selected
                </MenuButton>
                <MenuList>
                    {channels.map((c) => (
                        <MenuItem key={c.channel_id} onClick={() => handleChannelsChange(c.channel_id)}>
                            <Checkbox isChecked={selectedChannels.includes(c.channel_id)} onChange={() => handleChannelsChange(c.channel_id)}/>
                            <Text ml={5}>{c.channel_name} [{c.channel_subscribers.length} classes]</Text>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Box>
    );
};

export default EnhancedMultiSelect;
