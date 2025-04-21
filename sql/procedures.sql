DELIMITER $$

-- Procedure to archive a case instead of deleting
CREATE PROCEDURE sp_archive_case(
  IN p_case_id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN

  UPDATE Cases
  SET status = 'INACTIVE'
  WHERE case_id = p_case_id;

  UPDATE Appointment
  SET status = 'canceled'
  WHERE case_id = p_case_id
    AND appointment_date > NOW();

END$$

DELIMITER ;




DELIMITER $$

-- 1) Procedure to archive a client instead of deleting
CREATE PROCEDURE sp_archive_client(
  IN p_client_id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
  -- mark client as PAST CLIENT
  UPDATE Client
  SET status = 'PAST CLIENT'
  WHERE client_id = p_client_id;

  -- cancel all future appointments for that client
  UPDATE Appointment a
  JOIN Appointment_Client ac ON a.appointment_id = ac.appointment_id
  SET a.status = 'canceled'
  WHERE ac.client_id = p_client_id
    AND a.appointment_date > NOW();

  -- mark all their cases as INACTIVE
  UPDATE Cases c
  JOIN Client_Case cc ON c.case_id = cc.case_id
  SET c.status = 'INACTIVE'
  WHERE cc.client_id = p_client_id;
END$$

DELIMITER ;


DELIMITER $$

-- Procedure to handle staff removal with client reassignment or conversion to past client
CREATE PROCEDURE sp_remove_staff(
  IN p_staff_id VARCHAR(191),
  IN p_action ENUM('reassign', 'past client'),
  IN p_new_staff_id VARCHAR(191),
  IN p_client_id VARCHAR(191)
)
BEGIN
    /* 1) Mark staff status as 'not working' */
    UPDATE Staff
    SET status = 'not working'
    WHERE staff_id = p_staff_id;

    /* 2) Reassign or mark the chosen client as 'PAST CLIENT' */
    IF p_action = 'reassign' THEN
        /* Reassign only the cases shared between the departing staff and this client */
        UPDATE Staff_Case sc
        JOIN Client_Case cc ON sc.case_id = cc.case_id
        SET sc.staff_id = p_new_staff_id
        WHERE sc.staff_id = p_staff_id
          AND cc.client_id = p_client_id;
    ELSE
        /* Mark the client as 'PAST CLIENT' */
        UPDATE Client
        SET status = 'PAST CLIENT'
        WHERE client_id = p_client_id;

        /* Inactivate any cases if this staff is the only staff assigned to them */
        UPDATE Cases c
        JOIN Client_Case cc ON c.case_id = cc.case_id
        SET c.status = 'INACTIVE'
        WHERE cc.client_id = p_client_id
          AND c.case_id IN (
              SELECT sc2.case_id
              FROM Staff_Case sc2
              WHERE sc2.case_id = c.case_id
              GROUP BY sc2.case_id
              HAVING COUNT(*) = 1
                     AND MAX(sc2.staff_id) = p_staff_id
          );
    END IF;

    /* 3) Cancel future appointments for this staff + client */
    UPDATE Appointment a
    JOIN Appointment_Staff ast ON a.appointment_id = ast.appointment_id
    JOIN Appointment_Client ac ON a.appointment_id = ac.appointment_id
    SET a.status = 'canceled'
    WHERE ast.staff_id = p_staff_id
      AND ac.client_id = p_client_id
      AND a.appointment_date > NOW();

    /* 4) No removal from User or Staff; staff remains in the database with status='not working' */
END$$

DELIMITER ;






