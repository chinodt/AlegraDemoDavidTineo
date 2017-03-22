<?php
class Application_Model_Contacto
{
    /**
     * Funcion que ejecuta los llamados a API cURL
     * @author David Tineo
     *
     */
    function ExecCURL($tipooperacion, $id, $contactodatos)
    {
        $accessToken= "aca va el token de Alegra";
        $apiServer = "https://app.alegra.com/api/v1/contacts/".$id;            //set to your ProcessMaker address
        $headr = array();
        $headr[] = 'Accept: application/json';
        $headr[] = 'Content-type: application/json';
        $headr[] = 'Authorization: Basic '.$accessToken;
        $ch = curl_init();

        $options = array(
            CURLOPT_URL            => $apiServer,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER         => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING       => "",
            CURLOPT_AUTOREFERER    => true,
            CURLOPT_CONNECTTIMEOUT => 120,
            CURLOPT_TIMEOUT        => 120,
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        );
        curl_setopt_array( $ch, $options );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);//quitar los header HTML
        if($tipooperacion == "post")//Create
        {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($contactodatos)); //construye los parametros a pasar via Post
        }
        elseif($tipooperacion == "put")//Update
        {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($contactodatos)); //construye los parametros a pasar via Post
        }
        elseif($tipooperacion == "delete")
        {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        }

        $acontacto = json_decode(curl_exec($ch));
        $statuscode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $response = array();
        $response[] = $statuscode;
        $response[] = $acontacto;
        return $response;
    }

    /**
     * Funcion que ejecuta la lectura de un registro
     * @author David Tineo
     *
     */
    public function ReadContacto($id)
    {
        $response = $this->ExecCURL("",$id,"");
        $respuesta = null;
        if ( $response[0] == 200)
            $respuesta= $response[1];

        return json_encode($respuesta);
    }

    /**
     * Funcion que ejecuta la creación de un registro
     * @author David Tineo
     *
     */
    public function CreateContacto($name, $identification, $phonePrimary, $phoneSecondary, $observations, $email, $tipo, $address, $city)
    {
        $contactodireccion = array(
            "address" => $address,
            "city" => $city
        );

        $contactodatos = array(
            "name" => $name,
            "identification" => $identification,
            "phonePrimary" => $phonePrimary,
            "phoneSecondary" => $phoneSecondary,
            "observations" => $observations,
            "email" => $email,
            "type" => $tipo,
            "address" => $contactodireccion
        );
        $response = $this->ExecCURL("post","",$contactodatos);//Invoca a la función que ejecuta cURL
        $respuesta = null;
        if ( $response[0] != 201)
        {
            $respuesta = array("failed" => "false"); // <--
        }
        else{
            $respuesta = array("success" => "true"); // <--
        }
        return json_encode($respuesta);
    }

    /**
     * Funcion que actualiza un registro
     * @author David Tineo
     *
     */
    public function UpdateContacto($id,$name, $identification, $phonePrimary, $phoneSecondary, $observations, $email, $tipo, $address, $city)
    {
        $contactodireccion = array(
            "address" => $address,
            "city" => $city
        );

        $contactodatos = array(
            "name" => $name,
            "identification" => $identification,
            "phonePrimary" => $phonePrimary,
            "phoneSecondary" => $phoneSecondary,
            "observations" => $observations,
            "email" => $email,
            "type" => $tipo,
            "address" => $contactodireccion
        );

        $response = $this->ExecCURL("put",$id,$contactodatos);//Invoca a la función que ejecuta cURL
        $respuesta = null;
        if ( $response[0] != 200)
        {
            $respuesta = array("failed" => "false"); // <--
        }
        else{
            $respuesta = array("success" => "true"); // <--
        }
        return json_encode($respuesta);
    }

    /**
     * Funcion que lista registros
     * @author David Tineo
     *
     */
    public function ListContacto()
    {
        $response = $this->ExecCURL("","","");//Invoca a la función que ejecuta cURL
        $respuesta = null;
        if ( $response[0] == 200)
            $respuesta= $response[1];
        return json_encode($respuesta);//Devuelve respuesta en json
    }

    /**
     * Funcion que elimina un registro
     * @author David Tineo
     *
     */
    public function DeleteContacto($id)
    {
        $response = $this->ExecCURL("delete",$id,"");
        $respuesta = null;
        if ( $response[0] != 200)
        {
            $respuesta = array("failed" => "false"); // <--
        }
        else{
            $respuesta = array("success" => "true"); // <--
        }
        return json_encode($respuesta);
    }
}

