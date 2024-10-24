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
const KEY_IS_NOT_NULL = "validation:isNotEmpty"
const KEY_RETURNS_TRUE = ""

export function notNull(nomeCampo?: string){
    return function (target: any, propertyKey: string) {
        const metadados: MetadadosValidacao = {nome: nomeCampo ? nomeCampo : propertyKey};
        Reflect.defineMetadata(KEY_IS_NOT_NULL, metadados, target, propertyKey);
    };
}

export function returnsTrue(descricao: string){
  return function(target: any, propertyKey: string){
    const metadados: MetadadosValidacao = {descricao}
    Reflect.defineMetadata(KEY_RETURNS_TRUE,metadados, target,propertyKey);
  }
}
function lidarIsNotNull(obj: any, key: any, erro: BadRequest){
  const isNotEmpty:MetadadosValidacao = Reflect.getMetadata(KEY_IS_NOT_NULL, obj, key);
    if (!!isNotEmpty && obj !== false  && !obj[key]){
      erro.addObservacoes({descricao: `O campo ${isNotEmpty.nome} precisa ser preenchido`});
    }
}

function lidarReturnsTrue(obj: any, key: any, erro: BadRequest){
  const metadado:MetadadosValidacao = Reflect.getMetadata(KEY_RETURNS_TRUE, obj, key);
    if (!!metadado && obj[key]() === false){
      erro.addObservacoes({descricao: `${metadado.descricao}`});
    }
}

export function validation<Type>(obj:Type, ctr: new()=> Type){
  const novo_obj:any = plainToInstance(ctr, obj);
  const erro: BadRequest = new BadRequest();
  for (const key of Object.keys(novo_obj)) {
    lidarIsNotNull(novo_obj,key,erro);
    lidarReturnsTrue(novo_obj,key,erro)
  }
  erro.throwIfErros();
}
