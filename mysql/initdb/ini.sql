DROP DATABASE IF EXISTS db;
CREATE DATABASE db;
use db;

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS S;
DROP TABLE IF EXISTS C;
DROP TABLE IF EXISTS SC;
SET foreign_key_checks = 1;

CREATE TABLE S (
  Sno CHAR(9) primary key,
  Sname CHAR(20) not null,
  Ssex CHAR(3),
  Sage smallint,
  Sdept CHAR(20)
);

CREATE TABLE C (
  Cno CHAR(4) PRIMARY KEY,
  Cname CHAR(40) not null,
  Cpno CHAR(4),
  Ccredit SMALLINT,
  FOREIGN KEY (Cpno) REFERENCES C(Cno)
);

CREATE TABLE SC (
  Sno CHAR(9),
  Cno CHAR(4),
  Grade SMALLINT,
  PRIMARY KEY (Sno, Cno),
  FOREIGN KEY (Sno) REFERENCES S(Sno),
  FOREIGN KEY (Cno) REFERENCES C(Cno)
);


insert into S values ('201215121', '李勇', '男', 20, 'CS');
insert into S values ('201215122', '刘晨', '女', 19, 'CS');
insert into S values ('201215123', '王敏', '女', 18, 'MA');
insert into S values ('201215125', '张立', '男', 19, 'IS');
insert into S values ('201215127', '小红', '女', 20, 'SE');
insert into S values ('201215126', '小明', '男', 19, 'IS');

insert into C(Cno, Cname, Ccredit) values ('1', '数据库', 4);
insert into C(Cno, Cname, Ccredit) values ('2', '数学', 2);
insert into C(Cno, Cname, Ccredit) values ('3', '信息系统', 4);
insert into C(Cno, Cname, Ccredit) values ('4', '操作系统', 3);
insert into C(Cno, Cname, Ccredit) values ('5', '数据结构', 4);
insert into C(Cno, Cname, Ccredit) values ('6', '数据处理', 2);
insert into C(Cno, Cname, Ccredit) values ('7', 'C语言', 4);

update C set Cpno='5' where Cno='1';
update C set Cpno='1' where Cno='3';
update C set Cpno='6' where Cno='4';
update C set Cpno='7' where Cno='5';
update C set Cpno='6' where Cno='7';

insert into SC values ('201215121', '1', 92);
insert into SC values ('201215121', '2', 85);
insert into SC values ('201215121', '3', 88);
insert into SC values ('201215122', '2', 90);
insert into SC values ('201215122', '3', 80);
insert into SC values ('201215123', '5', 90);
insert into SC values ('201215125', '6', 80);
insert into SC values ('201215126', '4', 90);
insert into SC values ('201215126', '7', 80);
insert into SC values ('201215127', '1', 90);
