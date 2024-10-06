import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchSpecialistAppointments, selectSpecialistAppointments } from '../../store/slices/appointmentsSlice';
import { selectCurrentSpecialist, fetchCurrentSpecialist } from '../../store/slices/specialistSlice';
import { AppointmentResponseDto, AppointmentStatus } from '../../types/appointment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';

const localizer = momentLocalizer(moment);

const MonthEvent = ({ event }: { event: any }) => {
  console.log('Rendering MonthEvent:', event);
  return (
    <div style={{
      backgroundColor: event.status === AppointmentStatus.BOOKED ? '#f44336' : '#2196f3',
      color: 'white',
      padding: '2px 4px',
      borderRadius: '4px',
      fontSize: '0.8em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
    }}>
      {moment(event.start).format('HH:mm')} - {event.title}
      {event.status === AppointmentStatus.BOOKED && event.clientName && ` - ${event.clientName}`}
    </div>
  );
};

const SpecialistAppointments: React.FC = () => {
  
  const dispatch = useDispatch<AppDispatch>();
  const currentSpecialist = useSelector(selectCurrentSpecialist);
  const specialistAppointments = useSelector(selectSpecialistAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentSpecialist())
      .unwrap()
      .then((specialist) => {
        console.log('Current specialist:', specialist);
        if (specialist && specialist.id) {
          dispatch(fetchSpecialistAppointments(specialist.id));
        }
      })
      .catch(console.error);
  }, [dispatch]);
  
  useEffect(() => {
    console.log('Specialist appointments from Redux:', specialistAppointments);
  }, [specialistAppointments]);

  const events = specialistAppointments?.map((appointment: AppointmentResponseDto) => ({
    id: appointment.id,
    title: appointment.appointmentStatus === AppointmentStatus.BOOKED ? 'Забронировано' : 'Свободно',
    start: new Date(appointment.startTime),
    end: new Date(appointment.endTime),
    status: appointment.appointmentStatus,
    clientName: appointment.clientName,
  })) || [];

  const handleSelectEvent = (event: any) => {
    console.log('Selected event:', event);
    setSelectedDate(event.start);
    setOpenDialog(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; action: string }) => {
    if (slotInfo.action === 'click') {
      setSelectedDate(slotInfo.start);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getAppointmentsForDate = (date: Date) => {
    return specialistAppointments?.filter(
      (appointment: AppointmentResponseDto) =>
        moment(appointment.startTime).isSame(date, 'day')
    ) || [];
  };

  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: event.status === AppointmentStatus.BOOKED ? '#f44336' : '#2196f3',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style: style
    };
  };

  // Устанавливаем начало и конец рабочего дня
  const minTime = new Date();
  minTime.setHours(7, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(19, 0, 0);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Записи специалиста
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: '500px' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          min={minTime}
          max={maxTime}
          scrollToTime={minTime}
          step={30}
          timeslots={1}
          defaultView={Views.MONTH}
          components={{
            month: {
              event: MonthEvent,
            },
          }}
          formats={{
            eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
              return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
            },
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Записи на {selectedDate && moment(selectedDate).format('DD.MM.YYYY')}
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedDate &&
              getAppointmentsForDate(selectedDate).map((appointment: AppointmentResponseDto) => (
                <ListItem key={appointment.id}>
                  <ListItemText
                    primary={`${moment(appointment.startTime).format('HH:mm')} - ${moment(
                      appointment.endTime
                    ).format('HH:mm')}`}
                    secondary={
                      <>
                        {appointment.serviceName}
                        {appointment.appointmentStatus === AppointmentStatus.BOOKED && appointment.clientName &&
                          ` - Клиент: ${appointment.clientName}`}
                      </>
                    }
                  />
                  <Chip
                    label={appointment.appointmentStatus === AppointmentStatus.BOOKED ? 'Забронировано' : 'Свободно'}
                    color={appointment.appointmentStatus === AppointmentStatus.BOOKED ? 'error' : 'primary'}
                  />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecialistAppointments;