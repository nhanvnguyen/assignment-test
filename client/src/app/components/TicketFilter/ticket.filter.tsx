import React from 'react';
import styles from './ticket.filter.module.css';
import User from '../../models/user';

interface StatusFilterProps {
  selectedStatus: boolean | null;
  onStatusChange: (status: boolean | null) => void;
  users: User[];
  selectedUser: number | null;
  onUserChange: (userId: number | null) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  selectedStatus, 
  onStatusChange,
  users,
  selectedUser,
  onUserChange
}) => {
  return (
    <div className={styles['filterContainer']}>
      <div className={styles['filterSection']}>
        <h2 className={styles['title']}>Filter by Status:</h2>
        <div className={styles['filterGroup']}>
          <button 
            onClick={() => onStatusChange(null)}
            className={`${styles['filterButton']} ${selectedStatus === null ? styles['active'] : styles['inactive']}`}
          >
            All
          </button>
          <button 
            onClick={() => onStatusChange(false)}
            className={`${styles['filterButton']} ${selectedStatus === false ? styles['active'] : styles['inactive']}`}
          >
            Incomplete
          </button>
          <button 
            onClick={() => onStatusChange(true)}
            className={`${styles['filterButton']} ${selectedStatus === true ? styles['active'] : styles['inactive']}`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className={styles['filterSection']}>
        <h2 className={styles['title']}>Filter by Assignee:</h2>
        <div className={styles['filterGroup']}>
          <button 
            onClick={() => onUserChange(null)}
            className={`${styles['filterButton']} ${selectedUser === null ? styles['active'] : styles['inactive']}`}
          >
            All Users
          </button>
          <button 
            onClick={() => onUserChange(-1)}
            className={`${styles['filterButton']} ${selectedUser === -1 ? styles['active'] : styles['inactive']}`}
          >
            Unassigned
          </button>
          {users.map(user => (
            <button 
              key={user.id}
              onClick={() => onUserChange(user.id)}
              className={`${styles['filterButton']} ${selectedUser === user.id ? styles['active'] : styles['inactive']}`}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;