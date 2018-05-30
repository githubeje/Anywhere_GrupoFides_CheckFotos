/**
 * 2015-05-11
 * (A-002) Tipo, Categoría, Comentario, FOTO (máx. 3)
 * 
 * 
 * */


var pointAddress = 'No definido';
var stockImage = 'Sin Imagen';
var posLatitud = null;
var posLongitud = null;
var objAnywhere = null;
var quiebreSaveInit = false;

var idCliente = [];
var idCadena = [];
var idLocal = [];

var fecha = [];
var rutaFoto = [];
var tipoFoto = [];

var nombreModulo = "Busca im&aacute;genes por local";

$(".titleTag").each(function() {
	$(this).html(nombreModulo);
});

reiniciaFotos();
createPhotoButton(1,true, true, "Foto.");
createPhotoButton(2,false);
createPhotoButton(3,false);
createPhotoButton(4,false);

$('#quiebrestock_principal').bind( 'pagebeforecreate',function(event) {
	if(objAnywhere == null) {
		objAnywhere = new ObjAnyWhereCCL_CP({"disabled1":"no",
											 "disabled2":"no",
											 "disabled3":"no",
											 
											 "getCache1":"no",
											 "getCache2":"yes",
											 "getCache3":"yes",
											 
											 "omit4": "no",
											 
											 "system.producto.class":"required",
											 "system.producto.class":"required",
											 "omit5":"no"
									      });
		
		$("#combos").html(objAnywhere.getHtml());
	}
});

$('#quiebrestock_principal').bind( 'pageshow',function(event) {
	console.log("[pageshow] quiebrestock_promocion.js");
	objAnywhere.loadClients();
	var any = new Anywhere();
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: any.getWSAnywhere_context() + "services/p2s/querys/infoultimavisita/" + sessionStorage.getItem("rutT") ,
		dataType:"json",
		crossDomain : true,
		success: function(data,status,jqXHR) {
			$.each(data, function(key, val) {
				$.each(val, function(key2, val2) {
					idCliente.push(val2[0].value);
					idCadena.push(val2[1].value);
					idLocal.push(val2[2].value);					
				});
			});
			
			$( document ).ready(function() {
				console.log(data);
				document.getElementById('selectClientes_1000').options[document.getElementById('selectClientes_1000').selectedIndex].value = idCliente[0];
								
			});
		}, 
		error: function(XMLHttpRequest, textStatus, errorThrown) {
	       alert("error : " + textStatus + "," + errorThrown);
	    }
	});
});

function guardaProtocolo() {

	 var any = new Anywhere();
	 var vUrl = any.getWSAnywhere_context() + "services/alertasvarias/guardaprotocolo/";
	 var anySave = new AnywhereManager();
	 
	 var idUsuario = sessionStorage.getItem("rutT");
	 fecha = moment().format("YYYYMMDD");
	 hora = moment().format("HHmmss");
	 
	 anySave.save(vUrl,  { a1: idUsuario,
			a2: objAnywhere.getCliente(),
			a3: objAnywhere.getCadena(),
			a4: objAnywhere.getLocal(),
			a5: objAnywhere.getCategoria(),
			a6: objAnywhere.getProducto(),
			num_val1:6,
		},
		function(data,status,jqXHR) { 
			var mensajeSave = "Registro de fleje enviado correctamente";
			if(data != null) {
				if(data.dataFalsa == "dataFalsa") {
					mensajeSave = "Alerta sin conexion a Internet. Su informaci&oacute;n ser&aacute; guardada en el celular y apenas cuente con Internet usted debe reenviarla (ir al men&uacute; principal)";
				}
			}
			var popup = new MasterPopup();
			/*
			popup.alertPopup(nombreModulo, mensajeSave, {"funcYes":  function() {
			    $.mobile.changePage( "../menu.html", { transition: "flip"} );
			}});
			*/
		});
}

function saveQuiebre() {
	if(!quiebreSaveInit) {
		quiebreSaveInit = true;
		internalSave();
	}	

}


function internalSave() {
	
	 if ($('#formSend').validate({
		 	errorPlacement: function(error, element) {
				if ($(element).is('select')) {
					error.insertAfter($(element).parent());
				}
				else {
					error.insertAfter(element);
				}
			}
		 }).form() == true) {
		 
		 internalSave3();
	 }
	 else {
		 var popup = new MasterPopup();
		 popup.alertPopup(nombreModulo, "Debes completar todos los datos en rojo");
		 quiebreSaveInit = false;
	 } 
	 
}


function internalSave3() {

	 var any = new Anywhere();
	 var vUrl = any.getWSAnywhere_context() + "services/alertasvarias/saveextendido/";
	 var anySave = new AnywhereManager();
	 
	 var idUsuario = sessionStorage.getItem("rutT");
	 			
	var any = new Anywhere();
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: any.getWSAnywhere_context() + "services/p2s/querys/getimagenesdelocal/" + objAnywhere.getCliente() + "/" + objAnywhere.getCadena() + "/" + objAnywhere.getLocal() + "/" + objAnywhere.getDesde() + "/" + objAnywhere.getHasta(),
		dataType:"json",
		crossDomain : true,
		success: function(data,status,jqXHR) {
			$.each(data, function(key, val) {
				$.each(val, function(key2, val2) {
					fecha.push(val2[0].value);
					rutaFoto.push(val2[1].value);
					tipoFoto.push(val2[2].value);
				});
			});
			console.log("Desde: " + objAnywhere.getDesde());
			console.log("Hasta: " + objAnywhere.getHasta());
			console.log(data);
			/* Encabezado de tabla*/
			$("#tablafotos").html(
					""
				+	"	<div align='middle'>"
				+	"		<p><strong>Im&aacute;genes</strong></p>"
				+	" 	</div>"/*
				+	"<table align='middle' border='1'>"
				+   "   <tr> "
				+   " 		<td><strong>Fecha</strong></td>"
				+   " 		<td><strong>Imagen</strong></td>"
				+   "   </tr> "*/
			);
			/* Itera los resultados en la tabla*/
			for (var iterador = 0; iterador < fecha.length; iterador++){
				$("#tablafotos").append(
					"<table align='middle' border='1'>"	
				+	"   <tr border='1'> "
				+ 	"   	<td style='width:25%;  text-align: center;'>" 
				+	"			<strong>FECHA</strong></br>" + fecha[iterador] + "<br><br>"
				+	"			<strong>FOTO</strong></br>"  + tipoFoto[iterador] + "<br>"
				+ 	"		</td>"
				+ 	"   	<td style='width:75%; text-align: center;'>"
				+	"			<img src='http://www.anywhere.cl/fides/ws1/images/" + rutaFoto[iterador] + "' >"
				+   "       </td>"
				+ 	"   </tr> "
				+ 	"</table> "
				);
			};
			/* Cierra la tabla
			$("#tablafotos").append("</table>");*/
			
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
	       alert("error : " + textStatus + "," + errorThrown);
	    }
	})
	
}
