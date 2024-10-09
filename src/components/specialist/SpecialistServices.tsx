import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchServices } from '../../store/slices/servicesSlice';
import { ServiceResponseDto } from '../../types/services';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const SpecialistServices: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((state: RootState) => state.services.specialistServices);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Meine Dienstleistungen</Typography>
      {services.length === 0 ? (
        <Typography>Sie haben keine verfügbaren Dienstleistungen.</Typography>
      ) : (
        <List>
          {services.map((service: ServiceResponseDto) => (
            <ListItem key={service.id}>
              <ListItemText
                primary={`${service.title} - ${service.price} €`}
                secondary={service.description}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SpecialistServices;