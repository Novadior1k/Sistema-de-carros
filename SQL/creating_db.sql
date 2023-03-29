CREATE DATABASE localiza;
USE localiza;

CREATE TABLE clientes (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE veiculos (
    id  INT NOT NULL AUTO_INCREMENT,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano VARCHAR(4) NOT NULL,
    placa VARCHAR(7) NOT NULL,
    cor VARCHAR(20) NOT NULL,
    disponibilidade VARCHAR(1) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE reservas (
    id INT NOT NULL AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_veiculo INT NOT NULL,
    data_retirada DATE NOT NULL,
    data_devolucao DATE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_veiculo) REFERENCES veiculos(id)
);

