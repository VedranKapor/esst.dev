import { CURRENCY, UNITS, SECTOR, COMMODITY, TECHNOLOGY } from 'Src/includes/const.js';

export class CaseHTML {
    static renderAddCaseEmpty(){
        $('#Submit').show();
        $('#casename').val('');
        $('#scenarioname').val('');
        $('#description').val('');
        $('#yearsselect').empty();
        $('#startYear').val('');
        $('#endYear').val('');
    
        $("#scenarioname").prop('disabled', false);
    
         var container = $('<div />');
         $.each( SECTOR, function( key, value ) {
                container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Sector['+value+']" id="sector'+value+'" checked/><label for="sector'+value+'"  lang="en">'+value+'</label></div></div>');
            });
         $('#Sector').html(container);
    
    
         var container = $('<div />');
         $.each( COMMODITY, function( key, value ) {
                container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Commodity['+value+']" id="commodity'+value+'" checked/><label for="commodity'+value+'"  lang="en">'+value+'</label></div></div>');
            });
         $('#Commodity').html(container);
    
    
         var container = $('<div />');
         $.each( TECHNOLOGY, function( key, value ) {
                container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Technology['+value+']" id="technology'+value+'" checked/><label for="technology'+value+'"  lang="en">'+value+'</label></div></div>');
            });
         $('#Technology').html(container);
    
    
         var container = $('<select  class="form-control" name="Currency"/>');
         $.each( CURRENCY, function( key, value ) {
            if(value == "EUR")
                    container.append('<option value="'+value+'" selected name="currency'+value+'" id="'+value+'">'+value+'</option>');
            else
                    container.append('<option value="'+value+'" id="'+value+'">'+value+'</option>');
            });
         $('#Currency').html(container);
    
    
         var container = $('<select  class="form-control" name="Unit"/>');
         $.each( UNITS, function( key, value ) {
                  container.append('<option value="'+value+'" id="'+value+'">'+value+'</option>');
        });
        $('#Unit').html(container);
    
        $("#datepicker").jqxDateTimeInput({width: '100%', height: '30px', });
    }

    static renderAddCase(genData, sc){
        $('#Submit').hide();
        $('#NewCS').show();
        $('#Edit').show();
        $('#casename').val(genData.General.Casename);
        $('#scenarioname').val(sc);
        $("#scenarioname").prop('disabled', true);
        $('#description').val(genData.General.Description);
    
        $('input:radio[id='+ genData.General.Type +']').prop('checked', true);
    
        if(genData.General.Type == 'T1'){
            $('#Sector').addClass("disabledbutton");
            $('#Commodity').addClass("disabledbutton");
        }
    
         var container = $('<div />');
         $.each( SECTOR, function( key, value ) {
            if(genData.Sector.indexOf(value) != -1){
                    container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Sector['+value+']" id="sector'+value+'" checked/><label for="sector'+value+'"  lang="en">'+value+'</label></div></div>');
              }
              else{
                    container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Sector['+value+']" id="sector'+value+'"/><label for="sector'+value+'"  lang="en">'+value+'</label></div></div>');
              }
            });
         $('#Sector').html(container);
    
         var container = $('<div />');
         $.each( COMMODITY, function( key, value ) {
            if(genData.Commodity.indexOf(value) != -1){
                    container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Commodity['+value+']" id="commodity'+value+'" checked/><label for="commodity'+value+'"  lang="en">'+value+'</label></div></div>');
             }
             else{
                    container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Commodity['+value+']" id="commodity'+value+'"/><label for="commodity'+value+'"  lang="en">'+value+'</label></div></div>');
             }
            });
         $('#Commodity').html(container);
    
         var container = $('<div />');
         $.each( TECHNOLOGY, function( key, value ) {
            if(genData.Technology.indexOf(value) != -1){
                    container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Technology['+value+']" id="technology'+value+'" checked/><label for="technology'+value+'"  lang="en">'+value+'</label></div></div>');
             }
             else{
                    container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Technology['+value+']" id="technology'+value+'"/><label for="technology'+value+'"  lang="en">'+value+'</label></div></div>');
             }
            });
         $('#Technology').html(container);
    
         var container = $('<select  class="form-control" name="Currency"/>');
         $.each( CURRENCY, function( key, value ) {
            if(value==genData.General.Currency)
                    container.append('<option value="'+value+'" selected name="currency'+value+'" id="'+value+'">'+value+'</option>');
            else
                    container.append('<option value="'+value+'" id="'+value+'">'+value+'</option>');
            });
         $('#Currency').html(container);
    
         var container = $('<select  class="form-control" name="Unit"/>');
         $.each( UNITS, function( key, value ) {
             if (value== genData.General.Unit){
                    container.append('<option value="'+value+'" selected id="'+value+'">'+value+'</option>');
             }
             else{
                  container.append('<option value="'+value+'" id="'+value+'">'+value+'</option>');
             }
    
        });
        $('#Unit').html(container);
    
        $('#startYear').val(2000);
        $('#endYear').val(2050);
    
        var container = $('<div />');
        for(let i = 2000; i<=2050; i++){
            if(genData.Year.indexOf(i) != -1){
                 container.append('<div class="funkyradio years"><div class="funkyradio-default"><input type="checkbox" name="Years['+i+']" id="'+i+'" checked/><label for="'+i+'">'+i+'</label></div></div>');
            }
            else{
                container.append('<div class="funkyradio years"><div class="funkyradio-default"><input type="checkbox" name="Years['+i+']" id="'+i+'" /><label for="'+i+'">'+i+'</label></div></div>');
            }
        }
        $('#yearsselect').html(container);
        $("#btngroup").css('display', 'block');
        $("#checkall").css('display', 'none');
        $("#uncheckall").css('display', 'block');
    
        $("#datepicker").jqxDateTimeInput({width: '100%', height: '30px', });
    }
}
