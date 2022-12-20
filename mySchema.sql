create table list (
    id int NOT NULL auto_increment,
    done BOOlEAN not null,
    message text CHARACTER SET utf8 not null,
    priority int NOT NULL,
    primary key(id)
);

select * from list;