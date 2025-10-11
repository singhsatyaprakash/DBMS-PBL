use university;
CREATE TABLE admin (
	admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25),
    email VARCHAR(100) NOT NULL UNIQUE,
    token VARCHAR(500),
    password VARCHAR(100)
);

select * from admin;
delete from admin where admin_id=2;
drop table admin;


