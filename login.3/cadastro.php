<?php
    header('Content-Type: application/json');

    $servername = "localhost"; 
    $username = "tool";
    $password = "admin";
    $dbname = "seu_banco_de_dados";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die(json_encode(["success" => false, "message" => "Erro na conexão com o banco de dados: " . $conn->connect_error]));
    }

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Por favor, preencha todos os campos."]);
        $conn->close();
        exit();
    }

    $sql = "SELECT id, senha FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['senha'])) {
            echo json_encode(["success" => true, "message" => "Login bem-sucedido."]);
            // Aqui você iniciaria a sessão do usuário em um sistema real
        } else {
            echo json_encode(["success" => false, "message" => "Senha incorreta."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuário não encontrado."]);
    }

    $stmt->close();
    $conn->close();
?>