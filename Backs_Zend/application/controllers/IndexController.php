<?php

class IndexController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
        $ope=$_GET['ope'];
        $this->ConctactoRespuesta=null;
        if ($ope == "web")
        {
            $contacto = new Application_Model_Contacto();
            $this->ConctactoRespuesta = $contacto-> ListContacto();
        }
        echo $this->ConctactoRespuesta;
    }

    public function addAction()
    {
        $_name = $this->getRequest()->getPost("name");
        $_identification = $this->getRequest()->getPost("identification");
        $_phonePrimary = $this->getRequest()->getPost("phonePrimary");
        $_phoneSecondary = $this->getRequest()->getPost("phoneSecondary");
        $_observations = $this->getRequest()->getPost("observations");
        $_email = $this->getRequest()->getPost("email");
        $tipo = $this->getRequest()->getPost("tipo");
        $_address = $this->getRequest()->getPost("address");
        $_city = $this->getRequest()->getPost("city");

        $_tipo = array();
        $_tipo[] = $tipo;
        $contacto = new Application_Model_Contacto();
        $this->ConctactoRespuesta = $contacto-> CreateContacto($_name, $_identification, $_phonePrimary, $_phoneSecondary, $_observations, $_email, $_tipo, $_address, $_city);
        echo $this->ConctactoRespuesta;
    }

    public function editAction()
    {
        $_id = $this->getRequest()->getPost("id");
        $_name = $this->getRequest()->getPost("name");
        $_identification = $this->getRequest()->getPost("identification");
        $_phonePrimary = $this->getRequest()->getPost("phonePrimary");
        $_phoneSecondary = $this->getRequest()->getPost("phoneSecondary");
        $_observations = $this->getRequest()->getPost("observations");
        $_email = $this->getRequest()->getPost("email");
        $tipo = $this->getRequest()->getPost("tipo");
        $_address = $this->getRequest()->getPost("address");
        $_city = $this->getRequest()->getPost("city");

        $_tipo = array();
        $_tipo[] = $tipo;
        $contacto = new Application_Model_Contacto();
        $this->ConctactoRespuesta = $contacto-> UpdateContacto($_id,$_name, $_identification, $_phonePrimary, $_phoneSecondary, $_observations, $_email, $_tipo, $_address, $_city);
        echo $this->ConctactoRespuesta;

    }

    public function deleteAction()
    {
        $_id = $this->getRequest()->getPost("id");
        $contacto = new Application_Model_Contacto();
        $this->ConctactoRespuesta = $contacto-> DeleteContacto($_id);
        echo $this->ConctactoRespuesta;
    }

    public function readAction()
    {
        // action body
        $_id = $this->getRequest()->getPost("id");
        $contacto = new Application_Model_Contacto();
        $this->ConctactoRespuesta = $contacto-> ReadContacto($_id);
        echo $this->ConctactoRespuesta;
    }


}