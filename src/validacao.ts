import { BadRequest } from "projeto_erros_padroes";
import "reflect-metadata"
import {plainToInstance} from "class-transformer"
export interface MetadadosValidacao {
  nome?: string,
  descricao?: string,
  patter?: string,
  max?: number,
  min?:number
}

export interface MetadadadosField {
  type: any,
  descricao?: string,
  patter?: string,
  maxLength?: number,
  minLength?: number,
  example?: any,
  required?: boolean,
}

export interface ReturnsTrueInterface {
  funcionName: string,
  descricaoErro: string
}


export function field(metadados: MetadadadosField){
  return function (target: any, propertyKey: string) {
      
        
        
        // Se não houver nome nos metadados, usa o nome da propriedade
        
    
        // Garantir que target.constructor.metadados está definido
        if (!target.constructor.metadados) {
          target.constructor.metadados = {};
        }
        target.constructor.metadados[propertyKey] = metadados;
    };
}

export function returnsTrue(descricao: string){
  return function(target: any, propertyKey: string){
    if (!target.constructor.returnsTrue)
    target.constructor.returnsTrue  = [];
    target.constructor.returnsTrue.push({ funcionName: propertyKey, descricaoErro: descricao} as ReturnsTrueInterface)
  }
}
function lidarIsNotNull(obj: any, label: string,metadado: MetadadadosField, erro: BadRequest){
    const value = obj[label];
    console.log(!value)
    
    if (!value && value !== false  && !!metadado.required){
      erro.addObservacoes({descricao: `O campo ${label} precisa ser preenchido`});
    }
}

function lidarReturnsTrue(obj: any, metadado: ReturnsTrueInterface, erro: BadRequest){
  
    if (!!metadado && obj[metadado.funcionName]() === false){
      erro.addObservacoes({descricao: `${metadado.descricaoErro}`});
    }
}

export function validation<Type>(obj:Type, ctr: new()=> Type){
  const novo_obj:any = plainToInstance(ctr, obj);
  const erro: BadRequest = new BadRequest();
  for (const fieldLabel in novo_obj.constructor.metadados){
    lidarIsNotNull(novo_obj, fieldLabel,novo_obj.constructor.metadados[fieldLabel], erro);
  }
  const returnsTrue:ReturnsTrueInterface[]= novo_obj.constructor.returnsTrue as ReturnsTrueInterface[]
  if (returnsTrue)
  returnsTrue.forEach((metadado)=>{
    lidarReturnsTrue(obj,metadado , erro )
  });

  
    
  
  erro.throwIfErros();
}
