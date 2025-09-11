-- Tony Startk SQL queries
INSERT INTO account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@an'
);

-- Update Stark type account
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
AND account_id = 1;

-- Deleting Tony Stark's record
DELETE FROM account
WHERE account_id = 1;

-- Update description
UPDATE inventory
SET inv_description = REPLACE(
	inv_description,
	'small interiors',
	'a huge interior'
)
WHERE inv_id = 10;

-- Inner join query
SELECT inventory.inv_make,
inventory.inv_model,
classification.classification_name
FROM INVENTORY
	JOIN classification ON classification.classification_id = inventory.classification_id
	WHERE classification.classification_id = 2;

-- Update all records to add "/vehicles"
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles');