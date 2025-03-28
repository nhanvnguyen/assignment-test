import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Ticket  from '../../models/ticket';
import User  from '../../models/user';
import { useTickets } from '../../context/ticket.context';
import styles from './ticket.detail.module.css';

const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
      users, 
      createTicket, 
      getTicketById, 
      assignTicket, 
      unassignTicket,
      completeTicket,
      incompleteTicket 
    } = useTickets();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [description, setDescription] = useState<string>('');
    const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
    const [initialCompleted, setInitialCompleted] = useState<boolean>(false); 
    const [localCompleted, setLocalCompleted] = useState<boolean>(false); 
    const isNewTicket = id === 'new';
  
    useEffect(() => {
      const loadTicket = async () => {
        if (isNewTicket) {
          setLoading(false);
          return;
        }
  
        try {
          const ticketData = await getTicketById(parseInt(id || '0', 10));
          setTicket(ticketData);
          setDescription(ticketData.description);
          setSelectedAssignee(ticketData.assigneeId);
          setInitialCompleted(ticketData.completed); 
          setLocalCompleted(ticketData.completed); 
          setLoading(false);
        } catch (err) {
          setError('Failed to load ticket');
          setLoading(false);
        }
      };
  
      loadTicket();
    }, [id, isNewTicket, getTicketById]);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!description.trim()) {
        setError('Description is required');
        return;
      }
  
      try {
        if (isNewTicket) {
          const newTicket = await createTicket(description);
          
          if (selectedAssignee !== null) {
            await assignTicket(newTicket.id, selectedAssignee);
          }
          
          navigate('/');
        } else if (ticket) {
          if (selectedAssignee !== ticket.assigneeId) {
            if (selectedAssignee === null) {
              await unassignTicket(ticket.id);
            } else {
              await assignTicket(ticket.id, selectedAssignee);
            }
          }
  
          if (localCompleted !== initialCompleted) {
            if (localCompleted) {
              await completeTicket(ticket.id);
            } else {
              await incompleteTicket(ticket.id);
            }
          }
  
          navigate('/');
        }
      } catch (err) {
        setError('Failed to save ticket');
      }
    };
  
    const handleCancel = () => {
      if (ticket) {
        setDescription(ticket.description);
        setSelectedAssignee(ticket.assigneeId);
        setLocalCompleted(ticket.completed); 
      }
      navigate('/');
    };
  
    const handleToggleComplete = () => {
      setLocalCompleted(prev => !prev);
    };
  
    return (
      <div className={styles['container']}>
        <div className={styles['backButton']} onClick={() => navigate('/')}>
          ← Back to list
        </div>
  
        {loading ? (
          <div className={styles['loadingContainer']}>
            <div className={styles['loadingSpinner']}></div>
          </div>
        ) : (
          <div className={styles['formCard']}>
            <h1 className={styles['title']}>
              {isNewTicket ? 'Create New Ticket' : 'Edit Ticket'}
            </h1>
  
            {error && (
              <div className={styles['errorAlert']} role="alert">
                <span>{error}</span>
              </div>
            )}
  
            <form onSubmit={handleSubmit} data-testid="ticket-form">
              <div className={styles['formGroup']}>
                <label htmlFor="description" className={styles['label']}>Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={styles['textarea']}
                  data-testid="description-input"
                  required
                  disabled={isNewTicket ? false : true}
                ></textarea>
              </div>
  
              <div className={styles['formGroup']}>
                <label htmlFor="assignee" className={styles['label']}>Assignee</label>
                <select
                  id="assignee"
                  value={selectedAssignee || ''}
                  onChange={(e) => setSelectedAssignee(e.target.value ? parseInt(e.target.value, 10) : null)}
                  className={styles['select']}
                  data-testid="assignee-select"
                >
                  <option value="">Unassigned</option>
                  {users.map((user: User) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
  
              {!isNewTicket && ticket && (
                <div className={styles['formGroup']}>
                  <div className={styles['statusContainer']}>
                    <span className={styles['statusLabel']}>Status:</span>
                    <span 
                      className={`${styles['statusBadge']} ${
                        localCompleted 
                          ? styles['statusCompleted'] 
                          : styles['statusIncomplete']
                      }`}
                    >
                      {localCompleted ? 'Completed' : 'Incomplete'}
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleComplete}
                      className={styles['toggleButton']}
                    >
                      {localCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                  </div>
                </div>
              )}
  
              <div className={styles['buttonGroup']}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles['cancelButton']}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles['submitButton']}
                  data-testid="submit-button"
                >
                  {isNewTicket ? 'Create Ticket' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };
  
  export default TicketDetails;
  