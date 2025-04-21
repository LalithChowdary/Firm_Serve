create table if not exists projectf.Cases
(
    case_id     varchar(191) not null
        primary key,
    filing_date date         not null,
    court_name  varchar(100) not null,
    verdict     varchar(255) null,
    title       varchar(255) not null,
    case_type   varchar(50)  not null,
    status      varchar(50)  not null
)
    collate = utf8mb4_unicode_ci;

create table if not exists projectf.Appointment
(
    appointment_id   varchar(191) not null
        primary key,
    purpose          varchar(255) not null,
    location         varchar(100) not null,
    appointment_date datetime     not null,
    case_id          varchar(191) not null,
    status           varchar(40)  null,
    constraint fk_appointment_case_new
        foreign key (case_id) references projectf.Cases (case_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;



create table if not exists projectf.Document
(
    doc_id      varchar(191) not null
        primary key,
    upload_date datetime     not null,
    doc_type    varchar(50)  not null,
    case_id     varchar(191) not null,
    constraint fk_document_case_new
        foreign key (case_id) references projectf.Cases (case_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;


create table if not exists projectf.User
(
    id             varchar(191)                      not null
        primary key,
    email          varchar(191)                      not null,
    email_verified datetime(3)                       null,
    hashedPassword varchar(191)                      null,
    image          varchar(191)                      null,
    role           enum ('CLIENT', 'STAFF', 'ADMIN') not null,
    constraint email
        unique (email)
)
    collate = utf8mb4_unicode_ci;

create table if not exists projectf.Client
(
    client_id varchar(191) not null
        primary key,
    name      varchar(100) not null,
    address   varchar(255) not null,
    phone_no  varchar(20)  not null,
    status    varchar(40)  null,
    constraint fk_client_auth_new
        foreign key (client_id) references projectf.User (id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;

create table if not exists projectf.Appointment_Client
(
    appointment_id varchar(191) not null,
    client_id      varchar(191) not null,
    primary key (appointment_id, client_id),
    constraint fk_appclient_appointment_new
        foreign key (appointment_id) references projectf.Appointment (appointment_id)
            on update cascade,
    constraint fk_appclient_client_new
        foreign key (client_id) references projectf.Client (client_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;



create table if not exists projectf.Billing
(
    billing_id   varchar(191)   not null
        primary key,
    payment_date date           not null,
    payment_mode varchar(50)    not null,
    due_date     date           not null,
    status       varchar(50)    not null,
    amount       decimal(10, 2) not null,
    client_id    varchar(191)   not null,
    case_id      varchar(191)   not null,
    constraint fk_billing_case_new
        foreign key (case_id) references projectf.Cases (case_id)
            on update cascade,
    constraint fk_billing_client_new
        foreign key (client_id) references projectf.Client (client_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;


create table if not exists projectf.Client_Case
(
    client_id varchar(191) not null,
    case_id   varchar(191) not null,
    primary key (client_id, case_id),
    constraint fk_clientcase_case_new
        foreign key (case_id) references projectf.Cases (case_id)
            on update cascade,
    constraint fk_clientcase_client_new
        foreign key (client_id) references projectf.Client (client_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;


create table if not exists projectf.Staff
(
    staff_id       varchar(191) not null
        primary key,
    name           varchar(100) not null,
    experience     int          not null,
    phone_no       varchar(20)  not null,
    bar_number     varchar(50)  null,
    address        varchar(255) not null,
    specialisation varchar(100) null,
    s_role         varchar(50)  not null,
    designation    varchar(50)  null,
    image          varchar(512) null,
    status         varchar(40)  null,
    constraint fk_staffauth_staff_new
        foreign key (staff_id) references projectf.User (id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;

create table if not exists projectf.Appointment_Staff
(
    appointment_id varchar(191) not null,
    staff_id       varchar(191) not null,
    primary key (appointment_id, staff_id),
    constraint fk_appstaff_appointment_new
        foreign key (appointment_id) references projectf.Appointment (appointment_id)
            on update cascade,
    constraint fk_appstaff_staff_new
        foreign key (staff_id) references projectf.Staff (staff_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;



create table if not exists projectf.Expense
(
    expense_id   varchar(191)   not null
        primary key,
    amount       decimal(10, 2) not null,
    description  varchar(255)   not null,
    expense_date date           not null,
    paid_by      varchar(191)   not null,
    constraint fk_expense_staff
        foreign key (paid_by) references projectf.Staff (staff_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;

create table if not exists projectf.Staff_Case
(
    staff_id varchar(191) not null,
    case_id  varchar(191) not null,
    primary key (staff_id, case_id),
    constraint fk_staffcase_case_new
        foreign key (case_id) references projectf.Cases (case_id)
            on update cascade,
    constraint fk_staffcase_staff_new
        foreign key (staff_id) references projectf.Staff (staff_id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;





