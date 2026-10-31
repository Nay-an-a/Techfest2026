import TaskManager from '../components/TaskManager.jsx';
import ParticipantList from '../components/ParticipantList.jsx';
import { useParticipants } from '../context/ParticipantsContext.jsx';

export default function Tasks() {
  const { participants, storageError, saveParticipants } = useParticipants();

  const editParticipant = updatedParticipant => {
    saveParticipants(participants.map(participant =>
      participant.id === updatedParticipant.id ? updatedParticipant : participant
    ));
  };

  const deleteParticipant = participantId => {
    saveParticipants(participants.filter(participant => participant.id !== participantId));
  };

  const clearParticipants = () => {
    if (participants.length && window.confirm('Clear all saved participant registrations?')) {
      saveParticipants([]);
    }
  };

  return (
    <div className="page-container container tasks-page">
      <section className="page-intro">
        <span className="eyebrow">FOR THE PEOPLE BEHIND THE MAGIC</span>
        <h1>Organizer <span>workspace.</span></h1>
        <p>Manage attendee registrations and keep the little things moving behind the scenes.</p>
      </section>
      <ParticipantList
        participants={participants}
        onEdit={editParticipant}
        onDelete={deleteParticipant}
        onClearAll={clearParticipants}
        error={storageError}
      />
      <TaskManager />
      <p className="tasks-storage-note">Tasks are saved in this browser on this device. This demo does not sync tasks between organizers.</p>
    </div>
  );
}
