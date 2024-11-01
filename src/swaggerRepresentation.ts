import { MetadadadosField } from "./validacao"

export let swaggerJsonDefinition:any = {}
interface SwaggerDefinitionField{
    type: string,
    example?: any,
    description?: string
    minLength?: number, 
    maxLength?: number
}
interface SwaggerDefinitionRepresentation {
    type: string,
    required: string[],
    title: string,
    properties: {[key:string]:  SwaggerDefinitionField},
    

}


export function generateSwaggerRepresentation(obj:any){

    const representation:SwaggerDefinitionRepresentation =  {
        type: "object",
        required: [],
        title: obj.constructor.name,
        properties: {}
        
    }
    for (const fieldLabel in obj.constructor.metadados){
        const fieldMetadado:MetadadadosField = obj.constructor.metadados[fieldLabel];
        const name = fieldLabel;
        if (fieldMetadado.required){
            representation.required.push(name)
        }
        representation.properties[name] = {
            type: fieldMetadado.type,
            minLength: fieldMetadado.minLength,
            maxLength: fieldMetadado.maxLength
        
        } as SwaggerDefinitionField;
    }
    
    swaggerJsonDefinition[representation.title]=representation;
    

}

export function generateSwagger(){
    const obj:any = {"swagger": "2.0", "info": {"title": "teste", "version": "1.0.0"}, paths:{}}

    obj["definitions"] = swaggerJsonDefinition;
    console.log(JSON.stringify(obj));
}