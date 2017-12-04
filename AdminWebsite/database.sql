drop table if exists HighScores;
create table HighScores
(userID smallint auto_increment primary key not null,
userName char(50), 
event1Score int,
event2Score int,
event3Score int,
event4Score int,
event5Score int);

drop table if exists bugFacts;
create table bugFacts
(factID smallint auto_increment primary key not null,
bugFact varchar(2000));

drop table if exists loginPassword;
create table loginPassword
(passID smallint auto_increment primary key not null,
pass varchar(20));
