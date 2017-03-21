/*
Nombre: Contactos
Descripción: Aplicación desarrollada en extjs que realiza operaciones diversas en contactos
Creado por: David Tineo
Fecha: 21/03/2017
*/

/*Store que almacena datos provisionales de un contacto*/
Ext.create('Ext.data.JsonStore', {
    storeId: 'ContactosStoreInd',
    fields:[ 'id', 'identification', 'name','email', 'phonePrimary']
 });
 
 /*Store que almacena datos de los contactos consumidos desde un servicio en Zend que consume el API de Alegra*/
Ext.create('Ext.data.JsonStore', {
    storeId: 'ContactosStore',
	autoLoad: 'true',
    fields:[ 'id', 'identification', 'name','email', 'phonePrimary'],
     proxy: {
        type: 'ajax',
        url : 'http://localhost:8080/AlegraApp/public/index.php?ope=web',
        reader: {
            type: 'json'
        }		
    },
});

/*Store que llena data para el combo de tipo de contacto*/
Ext.create('Ext.data.Store', {
	storeId: 'tipos',
    fields: ['abbr', 'name'],
    data : [
        {"abbr":"client", "name":"Cliente"},
        {"abbr":"provider", "name":"Proveedor"},
    ]
});

/*Función que guarda los datos de un contacto*/
var datoscontacto = function(id){
	var index = Ext.StoreMgr.lookup('ContactosStore').findExact('id',id);
	var rec = Ext.StoreMgr.lookup('ContactosStore').getAt(index);
	var datatoload = Ext.StoreMgr.lookup('ContactosStoreInd');
	datatoload.loadRawData(rec);
};

/*Vista principal*/
Ext.define('AlegraWeb.view.Alegra.ContactosMain',{
    requires: [
        'AlegraWeb.view.Alegra.ContactosMainController',
        'AlegraWeb.view.Alegra.ContactosMainModel'
    ],

    controller: 'alegra-contactosmain',
    viewModel: {
        type: 'alegra-contactosmain'
    },	
    extend: 'Ext.form.Panel',
	renderTo: Ext.getBody(),
    title: 'Contact Info by David Tineo',
	autoScroll: true,
	xtype: 'form',
	url: 'http://localhost:8080/AlegraApp/public/index/add',
    items: [
	{
		xtype: 'gridpanel',
		store: 'ContactosStore',
		columns: [
			{ text: 'Id', dataIndex: 'id', width: 50 },
			{ text: 'Ident.', dataIndex: 'identification',width: 100 },
			{ text: 'Name', dataIndex: 'name', width: 250},
			{ text: 'E-Mail', dataIndex: 'email', width: 250},
			{ text: 'Phone', dataIndex: 'phonePrimary', width: 100},
			{
				xtype:'actioncolumn',
				width:50,
				items: [{
					iconCls: 'x-fa fa-cog',
					tooltip: 'Edit',
					handler: function(grid, rowIndex, colIndex) {
						//Busco el id del campo en el grid
						var rec = grid.getStore().getAt(rowIndex);
						var result = rec.get('id');
						//Con el id lleno el otro store que me va a guardar solo el dato del usuario que consulto.
						datoscontacto(result);
						var index = Ext.StoreMgr.lookup('ContactosStoreInd').findExact('id',result);
						var rec2 = Ext.StoreMgr.lookup('ContactosStoreInd').getAt(index);
						var form = this.up('form').getForm();
						//Pregunto si desea editar
						Ext.MessageBox.confirm('Confirmacion', "Va a proceder a editar este registro, ¿Está seguro/a de continuar?",function(btn, text){
						if(btn == 'yes') {
							form.url = 'http://localhost:8080/AlegraApp/public/index/edit';
							form.findField('id').setValue(rec2.data.id);
							form.findField('name').setValue(rec2.data.name);
							form.findField('identification').setValue(rec2.data.identification);
							form.findField('phonePrimary').setValue(rec2.data.phonePrimary);
							form.findField('phoneSecondary').setValue(rec2.data.phoneSecondary);
							form.findField('city').setValue(rec2.data.address.city);
							form.findField('address').setValue(rec2.data.address.address);
							form.findField('email').setValue(rec2.data.email);
							//lleno el combo
							form.findField('tipo').reset();
							form.findField('tipo').setValue(rec2.data.type);
							form.findField('observations').setValue(rec2.data.observations);
							form.findField('oper').setValue('E');							
						} else {
							alert ('Operación cancelada');
						}
						});

					}
				},{
					//icon: 'extjs-build/examples/restful/images/delete.png',
					iconCls: 'x-fa fa-bolt',
					tooltip: 'Delete',
					handler: function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						var result = rec.get('id');
						//Con el id lleno el otro store que me va a guardar solo el dato del usuario que consulto.
						datoscontacto(result);
						var index = Ext.StoreMgr.lookup('ContactosStoreInd').findExact('id',result);
						var rec2 = Ext.StoreMgr.lookup('ContactosStoreInd').getAt(index);
						var form = this.up('form').getForm();
						
						//Pregunto si desea editar
						Ext.MessageBox.confirm('Confirmacion', "Va a proceder a eliminar a este registro, ¿Está seguro/a de continuar?",function(btn, text){
						if(btn == 'yes') {
							form.url = 'http://localhost:8080/AlegraApp/public/index/delete';
							form.findField('id').setValue(rec2.data.id);
							form.findField('name').setValue(rec2.data.name);
							form.findField('identification').setValue(rec2.data.identification);
							form.findField('phonePrimary').setValue(rec2.data.phonePrimary);
							form.findField('phoneSecondary').setValue(rec2.data.phoneSecondary);
							form.findField('city').setValue(rec2.data.address.city);
							form.findField('address').setValue(rec2.data.address.address);
							form.findField('email').setValue(rec2.data.email);
							//lleno el combo
							form.findField('tipo').reset();
							form.findField('tipo').setValue(rec2.data.type);
							form.findField('observations').setValue(rec2.data.observations);
							form.findField('oper').setValue('D');	
						} else {
							alert ('Operación cancelada');
						}
						});
					}
				}]
			}			
			
		],
		height: 400,
		width: 1000,
    }, 
	{
		xtype: 'textfield',
		name: 'name',
		fieldLabel: 'Nombre',
		enforceMaxLength: true,
		maxLength: 50,
		allowBlank: false  // requires a non-empty value
	},
	{
		xtype: 'textfield',
		name: 'identification',
		fieldLabel: 'Identificacion',
		maxLength: 10,
		enforceMaxLength: true,
		allowBlank: false  // requires a non-empty value
	},
	{
		xtype: 'textfield',
		name: 'phonePrimary',
		enforceMaxLength: true,
		maxLength: 20,
		fieldLabel: 'Teléfono 1',
		allowBlank: false  // requires a non-empty value
	},	
	
	{
		xtype: 'textfield',
		name: 'phoneSecondary',
		enforceMaxLength: true,
		maxLength: 20,
		fieldLabel: 'Teléfono 2',
	},
	{
		xtype: 'textfield',
		name: 'city',
		enforceMaxLength: true,
		maxLength: 50,
		fieldLabel: 'Ciudad',
	},
	{
		xtype: 'textfield',
		name: 'address',
		enforceMaxLength: true,
		maxLength: 50,
		fieldLabel: 'Dirección',
	},				
	{
		xtype: 'textfield',
		name: 'email',
		enforceMaxLength: true,
		maxLength: 50,
		fieldLabel: 'Email Address',
		vtype: 'email'  // requires value to be a valid email address format
	},
	{
		name: 'tipo',					
		xtype:'combobox',
		fieldLabel:'Tipo',
		displayField:'name',
		valueField:'abbr',
		queryMode:'local',
		store: 'tipos',
		allowBlank: false  // requires a non-empty value
	},
	{
		xtype: 'textfield',
		name: 'observations',
		enforceMaxLength: true,
		maxLength: 100,
		width: 600,
		fieldLabel: 'Observaciones',
	},	
	{
		xtype: 'textfield',
		name: 'id',
		hidden: true
	},
	{
		xtype: 'textfield',
		name: 'oper',
		hidden: true
	},	
	{
		xtype: 'button',
		text: 'Aceptar',
		height: 40,
		width: 180,
		id: 'cmdNew',
		handler: function() {
			// The getForm() method returns the Ext.form.Basic instance:
			var form = this.up('form').getForm();
			if (form.isValid()) {
				// Submit the Ajax request and handle the response
				form.submit({
					success: function(form, action) {
						alert('Operación ejecutada con éxito');
						var datatoload = Ext.StoreMgr.lookup('ContactosStore');
						datatoload.load();
						form.findField('id').setValue('');
						form.findField('name').setValue('');
						form.findField('identification').setValue('');
						form.findField('phonePrimary').setValue('');
						form.findField('phoneSecondary').setValue('');
						form.findField('city').setValue('');
						form.findField('address').setValue('');
						form.findField('email').setValue('');
						//lleno el combo
						form.findField('tipo').reset();
						form.findField('tipo').setValue('');
						form.findField('observations').setValue('');
						form.findField('oper').setValue('');
						form.url = 'http://localhost:8080/AlegraApp/public/index/add';
					},
					failure: function(form, action) {
						alert('No se detecta respuesta desde el back');
						var datatoload = Ext.StoreMgr.lookup('ContactosStore');
						datatoload.load();
						form.findField('id').setValue('');
						form.findField('name').setValue('');
						form.findField('identification').setValue('');
						form.findField('phonePrimary').setValue('');
						form.findField('phoneSecondary').setValue('');
						form.findField('city').setValue('');
						form.findField('address').setValue('');
						form.findField('email').setValue('');
						//lleno el combo
						form.findField('tipo').reset();
						form.findField('tipo').setValue('');
						form.findField('observations').setValue('');
						form.findField('oper').setValue('');
						form.url = 'http://localhost:8080/AlegraApp/public/index/add';
					}
				});
			}
			else 
			{
				alert( "Por favor, valide los campos." );
			}
		}
	},		
	{
		xtype: 'button',
		height: 40,
		width: 180,
		id: 'cmdCancel',		
        text: 'Cancel',
        handler: function() {
			var datatoload = Ext.StoreMgr.lookup('ContactosStore');
			datatoload.load();
			var form = this.up('form').getForm();
			form.findField('id').setValue('');
			form.findField('name').setValue('');
			form.findField('identification').setValue('');
			form.findField('phonePrimary').setValue('');
			form.findField('phoneSecondary').setValue('');
			form.findField('city').setValue('');
			form.findField('address').setValue('');
			form.findField('email').setValue('');
			//lleno el combo
			form.findField('tipo').reset();
			form.findField('tipo').setValue('');
			form.findField('observations').setValue('');
			form.findField('oper').setValue('');
        }
	}		
	],	
});