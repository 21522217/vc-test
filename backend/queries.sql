-- Step 1: Creating ENUM type for car status
CREATE TYPE car_status AS ENUM ('Not inspected', 'Inspecting', 'Inspected');
-- Step 2: Creating the cars table
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status car_status NOT NULL DEFAULT 'Not inspected'
);
-- Step 3: Creating the criteria table
CREATE TABLE criteria (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
-- Step 4: Creating the inspection_criteria table (many-to-many relationship between cars and criteria)
CREATE TABLE inspection_criteria (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL,
    criteria_id INT NOT NULL,
    is_good BOOLEAN NOT NULL,
    note TEXT,
    CONSTRAINT fk_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    CONSTRAINT fk_criteria FOREIGN KEY (criteria_id) REFERENCES criteria(id) ON DELETE CASCADE,
    CONSTRAINT check_note_required CHECK (
        is_good = TRUE
        OR (
            is_good = FALSE
            AND note IS NOT NULL
        )
    ),
    CONSTRAINT unique_car_criteria UNIQUE (car_id, criteria_id)
);
-- Step 5: Creating indexes for better performance
CREATE INDEX idx_car_id ON inspection_criteria(car_id);
CREATE INDEX idx_criteria_id ON inspection_criteria(criteria_id);
-- Step 6: Insert sample data (cars)
INSERT INTO cars (name, status)
VALUES ('Car A', 'Not inspected'),
    ('Car B', 'Not inspected'),
    ('Car C', 'Not inspected'),
    ('Car D', 'Not inspected'),
    ('Car E', 'Not inspected'),
    ('Car F', 'Not inspected'),
    ('Car G', 'Not inspected'),
    ('Car H', 'Not inspected'),
    ('Car I', 'Not inspected'),
    ('Car J', 'Not inspected');
-- Step 7: Insert sample data (criteria)
INSERT INTO criteria (name)
VALUES ('Brakes'),
    ('Lights'),
    ('Tires'),
    ('Engine'),
    ('Battery'),
    ('Suspension'),
    ('Exhaust'),
    ('Transmission'),
    ('Steering'),
    ('Fluid levels');
-- Step 8: Insert default inspection criteria for all existing cars and criteria
-- This ensures every car is connected to every criterion with default values
INSERT INTO inspection_criteria (car_id, criteria_id, is_good, note)
SELECT c.id AS car_id,
    crit.id AS criteria_id,
    false AS is_good,
    -- Default value for is_good
    'Not inspected yet' AS note -- Default note value
FROM cars c
    CROSS JOIN criteria crit
WHERE NOT EXISTS (
        SELECT 1
        FROM inspection_criteria ic
        WHERE ic.car_id = c.id
            AND ic.criteria_id = crit.id
    );
-- Step 9: Create a function to automatically assign default inspection criteria to new cars
CREATE OR REPLACE FUNCTION assign_default_inspections() RETURNS TRIGGER AS $$ BEGIN -- Insert default inspection criteria for the new car
INSERT INTO inspection_criteria (car_id, criteria_id, is_good, note)
SELECT NEW.id AS car_id,
    crit.id AS criteria_id,
    false AS is_good,
    'Not inspected yet' AS note
FROM criteria crit;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Step 10: Create a trigger to automatically run the function when a new car is inserted
CREATE TRIGGER after_car_insert
AFTER
INSERT ON cars FOR EACH ROW EXECUTE FUNCTION assign_default_inspections();
-- Step 11: Create a function to automatically assign new criteria to all existing cars
CREATE OR REPLACE FUNCTION assign_default_inspections_for_new_criteria() RETURNS TRIGGER AS $$ BEGIN -- Insert the new criterion for all existing cars with default values
INSERT INTO inspection_criteria (car_id, criteria_id, is_good, note)
SELECT c.id AS car_id,
    NEW.id AS criteria_id,
    false AS is_good,
    'Not inspected yet' AS note
FROM cars c
WHERE NOT EXISTS (
        SELECT 1
        FROM inspection_criteria ic
        WHERE ic.car_id = c.id
            AND ic.criteria_id = NEW.id
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Step 12: Create a trigger to run after a new criterion is inserted
CREATE TRIGGER after_criteria_insert
AFTER
INSERT ON criteria FOR EACH ROW EXECUTE FUNCTION assign_default_inspections_for_new_criteria();
-- Step 13: Update the car status based on the number of passed criteria
-- If all criteria are good, set status to 'Inspected'
-- If some but not all criteria are good, set status to 'Inspecting'
-- If no criteria are good, set status to 'Not inspected'
-- this is updating manually in the database
WITH criteria_summary AS (
    SELECT car_id,
        COUNT(*) FILTER (
            WHERE is_good = true
        ) as passed_criteria,
        COUNT(*) as total_criteria
    FROM inspection_criteria
    GROUP BY car_id
)
UPDATE cars
SET status = CASE
        WHEN passed_criteria = total_criteria THEN 'Inspected'::car_status
        WHEN passed_criteria > 0
        AND passed_criteria < total_criteria THEN 'Inspecting'::car_status
        ELSE 'Not inspected'::car_status
    END
FROM criteria_summary
WHERE cars.id = criteria_summary.car_id;
-- Step 13 Alternative
CREATE OR REPLACE FUNCTION update_car_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate car status based on inspection criteria
    WITH criteria_summary AS (
        SELECT car_id,
               COUNT(*) FILTER (WHERE is_good = true) AS passed_criteria,
               COUNT(*) AS total_criteria
        FROM inspection_criteria
        GROUP BY car_id
    )
    UPDATE cars
    SET status = CASE
        WHEN passed_criteria = total_criteria THEN 'Inspected'::car_status
        WHEN passed_criteria > 0 AND passed_criteria < total_criteria THEN 'Inspecting'::car_status
        ELSE 'Not inspected'::car_status
    END
    FROM criteria_summary
    WHERE cars.id = criteria_summary.car_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER after_criteria_update
AFTER UPDATE ON inspection_criteria
FOR EACH ROW EXECUTE FUNCTION update_car_status();


-------------------------------------------------------------------------------------------------------------- if you mess things up

-- Drop the triggers first to avoid dependency issues
DROP TRIGGER IF EXISTS after_car_insert ON cars;
DROP TRIGGER IF EXISTS after_criteria_insert ON criteria;

-- Drop the functions
DROP FUNCTION IF EXISTS assign_default_inspections;
DROP FUNCTION IF EXISTS assign_default_inspections_for_new_criteria;

-- Drop the tables
DROP TABLE IF EXISTS inspection_criteria CASCADE;
DROP TABLE IF EXISTS criteria CASCADE;
DROP TABLE IF EXISTS cars CASCADE;

-- Drop the ENUM type
DROP TYPE IF EXISTS car_status;