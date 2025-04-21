DELIMITER $$

-- Set default location for appointments
CREATE TRIGGER assign_default_courtroom 
BEFORE INSERT ON projectf.Appointment
FOR EACH ROW
BEGIN
  IF NEW.location IS NULL THEN
    SET NEW.location = 'Office R1';
  END IF;
END$$

-- Set default status for appointments
CREATE TRIGGER before_appointment_insert
BEFORE INSERT ON projectf.Appointment
FOR EACH ROW
BEGIN
    -- Set status to 'scheduled' if not provided or NULL
    IF NEW.status IS NULL OR NEW.status = '' THEN
        SET NEW.status = 'scheduled';
    END IF;
END$$

-- Prevent booking appointments in the past
CREATE TRIGGER prevent_past_appointments
BEFORE INSERT ON projectf.Appointment
FOR EACH ROW
BEGIN
  IF NEW.appointment_date < CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot book appointment in the past';
  END IF;
END$$

-- Archive case before deletion
CREATE TRIGGER before_case_delete
BEFORE DELETE ON projectf.Cases
FOR EACH ROW
BEGIN
    -- Call the archive procedure with the case_id being deleted
    CALL sp_archive_case(OLD.case_id);

    -- Prevent the actual deletion by signaling an error
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cases cannot be deleted directly. They have been archived instead.';
END$$

-- Set default status for new cases
CREATE TRIGGER set_case_status
BEFORE INSERT ON projectf.Cases
FOR EACH ROW
BEGIN
  SET NEW.status = 'Open';
END$$

-- Archive client before deletion
CREATE TRIGGER tr_before_client_delete
BEFORE DELETE ON projectf.Client
FOR EACH ROW
BEGIN
  CALL sp_archive_client(OLD.client_id);
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Client archived as PAST CLIENT; delete aborted.';
END$$

-- Set default filing date for new cases
CREATE TRIGGER default_case_start_date
BEFORE INSERT ON projectf.Cases
FOR EACH ROW
BEGIN
  IF NEW.filing_date IS NULL THEN
    SET NEW.filing_date = CURDATE();
  END IF;
END$$

DELIMITER ;